'use strict';

(function () {

  /* @ngInject */
  function AllArtifactsFreshener(_allArtifactsApi_, _payloadExtractor_) {
    var self = this;
    this.server = _allArtifactsApi_;
    this.extractor = _payloadExtractor_;
    this.failedAndPassing = {};
    this.versionSummary = [];
    this.getAllArtifacts = function (callback, chosenArtifactId) {
      // TODO how should I best do this?
      function callingServer() {
        self.server.getAllArtifacts().then(function (response) {
          var payload = response.data;
          self.failedAndPassing = self.extractor.extract(payload);
          callback(self.failedAndPassing);
        });
      }
      function updatingChosenArtifact() {
        var artifactRemovedFromPassing = removeArtifactFromPassingArray(chosenArtifactId);
        if (artifactRemovedFromPassing) {
          self.failedAndPassing.failing.unshift(artifactRemovedFromPassing);
          callback(self.failedAndPassing);
        }
      }
      function failedAndPassingIsEmpty() {
        return _.isEqual(self.failedAndPassing, {});
      }

      if (failedAndPassingIsEmpty()) {
        callingServer();
      } else {
        updatingChosenArtifact();
      }
    };

    this.getVersionSummary = function (artifactData, versionSummaryCallback) {
      this.server.getVersionSummary(artifactData.version, artifactData.artifactId, artifactData.groupId, artifactData.event).then(function (response) {
        self.versionSummary = response.data;
        versionSummaryCallback(self.versionSummary);
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
