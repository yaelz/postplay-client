'use strict';

(function () {

  /* @ngInject */
  function PostPlayUtils() {
    // AngularJS will instantiate a singleton by calling "new" on this function

    // Public API here
    var self = this;
    this.filter = function (array, objectToRemove) {
      return array.filter(function (currObjInTable) {
        return !_.isEqual(objectToRemove, currObjInTable);
      });
    };
    this.getArtifactStatus = function (artifact) {
      var status = 'PASSED';
      if (artifact.testStatusEnum === 'STATUS_COMPLETED_WITH_ERRORS' || artifact.analysisResultEnum === 'TEST_FAILED') {
        status = 'FAILED';
      } else if (artifact.testStatusEnum === 'INCOMPLETE' || artifact.testStatusEnum === 'STATUS_COMPLETED_WITH_WARNINGS' ||
        artifact.analysisResultEnum === 'TEST_INCONCLUSIVE' || artifact.analysisResultEnum === 'TEST_NOT_ANALYSED') {
        status = 'WARNING';
      }
      return status;
    };
    this.statusIsFailedOrWarning = function (status) {
      return status !== 'PASSED';
    };
    this.artifactsHaveSameArtifactIdAndGroupId = function (artifact1, artifact2) {
      return artifact1.artifactId === artifact2.artifactId && artifact1.groupId === artifact2.groupId;
    };
    this.getFailedAndNotFailedArtifactsObject = function (arrayOfArtifactsDataObjects) {
      var passedArtifacts = [];
      var failedArtifacts = [];
      arrayOfArtifactsDataObjects.forEach(function (artifactDataObject) {
        var status = self.getArtifactStatus(artifactDataObject);
        if (!self.statusIsFailedOrWarning(status)) {
          passedArtifacts.push(artifactDataObject);
        } else {
          failedArtifacts.push(artifactDataObject);
        }
      });
      return {passing: passedArtifacts, failing: failedArtifacts};
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('postPlayUtils', PostPlayUtils);

})();
