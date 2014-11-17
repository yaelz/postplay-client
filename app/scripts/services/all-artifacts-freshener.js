'use strict';

(function () {

  /* @ngInject */
  function AllArtifactsFreshener(_allArtifactsApi_, _payloadExtractor_) {
    var self = this;
    this.server = _allArtifactsApi_;
    this.extractor = _payloadExtractor_;
    this.failedAndPassing = {};
    this.versionSummary = [];
    this.getAllArtifacts = function () {
      return self.server.getAllArtifacts()
        .then(function (response) {
          var allArtifacts = response.data;
          self.failedAndPassing = self.extractor.extract(allArtifacts);
          return self.failedAndPassing;
        });
    };

    this.updateChosenArtifact = function (chosenArtifactId) {
      var artifactRemovedFromPassing = removeArtifactFromPassingArray(chosenArtifactId);
      if (artifactRemovedFromPassing) {
        self.failedAndPassing.failing.unshift(artifactRemovedFromPassing);
      }
      return self.failedAndPassing;
    };

    this.getVersionSummary = function (artifactData) {
      return this.server.getVersionSummary(artifactData.version, artifactData.artifactId, artifactData.groupId, artifactData.event)
        .then(function (response) {
          return response.data;
        });
    };

    function removeArtifactFromPassingArray(artifactIdToRemove) {
      if (!artifactIdToRemove) {
        return false;
      }
      var removedObj;
      self.failedAndPassing.passing = self.failedAndPassing.passing.filter(function (passedArtifact) {
        if (passedArtifact.artifactId === artifactIdToRemove) {
          removedObj = passedArtifact;
          return false;
        } else {
          return true;
        }
      });
      return removedObj;
    }
  }

  angular
    .module('postplayTryAppInternal')
    .service('allArtifactsFreshener', AllArtifactsFreshener);
})();
