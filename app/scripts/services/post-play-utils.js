'use strict';

(function () {

  /* @ngInject */
  function PostPlayUtils() {
    // AngularJS will instantiate a singleton by calling "new" on this function

    // Public API here
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
      if (status === 'PASSED') {
        return false;
      }
      return true;
    };
    this.artifactsHaveSameArtifactIdAndGroupId = function (artifact1, artifact2) {
      return artifact1.artifactId === artifact2.artifactId && artifact1.groupId === artifact2.groupId;
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('postPlayUtils', PostPlayUtils);

})();
