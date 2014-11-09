'use strict';

(function () {

  /* @ngInject */
  function AllArtifactsFreshener(_basicTestInfoServerApi_, _artifactsTablesEntity_, _postPlayUtils_) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;
    this.artifactsTablesEntity = _artifactsTablesEntity_;
    this.postPlayUtils = _postPlayUtils_;
    this.artifactsNames = [];

    // Public API here
    function refreshAllArtifacts() {
      self.basicTestInfoServerApi.getAllArtifacts().then(function (response) {
        var failedAndNotFailedArtifactsObject = self.postPlayUtils.getFailedAndNotFailedArtifactsObject(response.data);
        var failedArtifacts = failedAndNotFailedArtifactsObject.failedArtifacts;
        var passedArtifacts = failedAndNotFailedArtifactsObject.passedArtifacts;
        failedArtifacts.forEach(function (newArtifactData) {
          var artifactStatus = self.postPlayUtils.getArtifactStatus(newArtifactData);
          var currentArtifactWrapped = {artifactData: newArtifactData, isChosen: false, status: artifactStatus};
          self.artifactsTablesEntity.addToFailedAndChosenTable(currentArtifactWrapped);
        });
        passedArtifacts.forEach(function (newArtifactData) {
          var artifactStatus = self.postPlayUtils.getArtifactStatus(newArtifactData);
          var currentArtifactWrapped = {artifactData: newArtifactData, isChosen: false, status: artifactStatus};
          self.artifactsTablesEntity.addToPassedArtifactsTable(currentArtifactWrapped);
        });
      });
    }
    refreshAllArtifacts();
  }

  angular
    .module('postplayTryAppInternal')
    .service('allArtifactsFreshener', AllArtifactsFreshener);

})();
