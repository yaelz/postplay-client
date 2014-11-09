'use strict';

(function () {

  /* @ngInject */
  function AllArtifactsFreshener(_basicTestInfoServerApi_, _artifactsTablesEntity_, _postPlayUtils_) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;
    this.artifactsTablesEntity = _artifactsTablesEntity_;
    this.postPlayUtils = _postPlayUtils_;

    this.updateChosenArtifactDataToAddToTable = function (artifactIdToAdd) {
      var artifactToAdd = self.artifactsTablesEntity.removeFromPassedArtifactsTableByArtifactId(artifactIdToAdd);
      self.artifactsTablesEntity.addToBeginningOfFailedAndChosenArtifactsTable(artifactToAdd);
    };
    // Public API here
    function createNewWrappedObject(newArtifactData) {
      return {artifactData: newArtifactData, isChosen: false, status: self.postPlayUtils.getArtifactStatus(newArtifactData)};
    }

    function createArtifactForUIAndAddItToRelevantTable(artifactsArray, addingFunction) {
      artifactsArray.forEach(function (newArtifactData) {
        var currentArtifactWrapped = createNewWrappedObject(newArtifactData);
        addingFunction(currentArtifactWrapped);
      });
    }

    function refreshAllArtifacts() {
      self.basicTestInfoServerApi.getAllArtifacts().then(function (response) {
        var failedAndNotFailedArtifactsObject = self.postPlayUtils.getFailedAndNotFailedArtifactsObject(response.data);
        var failedArtifacts = failedAndNotFailedArtifactsObject.failedArtifacts;
        var passedArtifacts = failedAndNotFailedArtifactsObject.passedArtifacts;
        createArtifactForUIAndAddItToRelevantTable(failedArtifacts, self.artifactsTablesEntity.addToFailedAndChosenTable);
        createArtifactForUIAndAddItToRelevantTable(passedArtifacts, self.artifactsTablesEntity.addToPassedArtifactsTable);
      });
    }
    refreshAllArtifacts();
  }

  angular
    .module('postplayTryAppInternal')
    .service('allArtifactsFreshener', AllArtifactsFreshener);

})();
