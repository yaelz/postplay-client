'use strict';

(function () {

  /* @ngInject */
  /*global localStorage: false */
  function AllArtifactsFreshener(_allArtifactsApi_, _payloadExtractor_) {
    var self = this;
    this.server = _allArtifactsApi_;
    this.extractor = _payloadExtractor_;
    this.failedAndPassing = {};
    this.versionSummary = [];
    this.getAllArtifacts = function () {
      return self.server.getAllArtifacts()
        .then(function (response) {
          self.allArtifacts = response.data;
          self.failedAndPassing = self.extractor.extract(self.allArtifacts);
          return self.failedAndPassing;
        });
    };

    this.updateChosenArtifact = function (chosenArtifactId) {
      localStorage.setItem(chosenArtifactId, true);
      angular.copy(self.extractor.extract(self.allArtifacts), self.failedAndPassing);
      return self.failedAndPassing;
    };

    this.getVersionSummary = function (artifactData) {
      return this.server.getVersionSummary(artifactData.version, artifactData.artifactId, artifactData.groupId, artifactData.event)
        .then(function (response) {
          return response.data;
        });
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('allArtifactsFreshener', AllArtifactsFreshener);
})();
