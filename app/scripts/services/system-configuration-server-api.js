'use strict';

(function () {

  /* @ngInject */
  function SystemConfigurationServerApi(systemConfigurationServerResponse, $http, serverApiUrl) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var testData = {};
    var artifactData = {};

    // Public API here
    this.getTestDataById = function (testId) {
      var API_URL = serverApiUrl.TEST_DATA_BY_ID_API_URL_PREFIX + '?testId=' + testId;
      return runHttpGetSuccessAndError(API_URL, testData);
    };

    this.getArtifactData = function (artifactId, groupId) {
      var API_URL = serverApiUrl.ARTIFACT_DATA_API_URL_PREFIX + '?artifactId=' + artifactId + '?groupId=' + groupId;
      return runHttpGetSuccessAndError(API_URL, artifactData);
    };

    function runHttpGetSuccessAndError(API_URL, destinationVariable) {
      $http.get(API_URL)
        .success(function (response) {
          angular.copy(response, destinationVariable);
        })
        .error(function () {});
      return destinationVariable;
    }
  }

  angular
    .module('postplayTryAppInternal')
    .service('systemConfigurationServerApi', SystemConfigurationServerApi);

})();
