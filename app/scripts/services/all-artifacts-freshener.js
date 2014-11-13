'use strict';

(function () {

  /* @ngInject */
  function AllArtifactsFreshener(_basicTestInfoServerApi_, _payloadExtractor_) {
    var self = this;
    this.server = _basicTestInfoServerApi_;
    this.extractor = _payloadExtractor_;
    this.failedAndPassing = {};
    this.getAllArtifacts = function (callback, chosenArtifactId) {
      if (_.isEqual(self.failedAndPassing, {})) {
        this.server.getAllArtifacts().then(function (response) {
          var payload = response.data;
          self.failedAndPassing = self.extractor.extract(payload);
          callback(self.failedAndPassing);
        });
      } else {
        var chosenArtifact = removeArtifactFromPassingArray(chosenArtifactId);
        if (chosenArtifact) {
          self.failedAndPassing.failing.unshift(chosenArtifact);
          callback(self.failedAndPassing);
        }
      }
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
