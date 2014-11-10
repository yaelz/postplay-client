'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoServerApi($http, serverApiUrl) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    $http.defaults.headers.common = {Accept: 'application/json', 'Content-Type': 'application/json'};
    this.thereWasServerError = false;
    this.serverErrors = {errorGettingRunningArtifacts: false};
//    var self = this;
    var API_URL;

    function runHttpGetSuccessAndError(API_URL) {
      API_URL = serverApiUrl.PREFIX + API_URL;
      return $http.get(API_URL).then(function (response) {
        return response;
      });
    }
    // Public API here
//    this.getAllArtifacts = function (callback) {
//
//      API_URL = serverApiUrl.ALL_ARTIFACTS_API_URL;
//      runHttpGetSuccessAndError(API_URL).then(function (response) {
//        callback(response);
//      });
//    };

    this.getAllArtifacts = function () {
      API_URL = serverApiUrl.ALL_ARTIFACTS_API_URL;
      return runHttpGetSuccessAndError(API_URL);
    };

    this.getLifecycleBuilds = function () {
      API_URL = serverApiUrl.BUILDS_API_URL;
      return runHttpGetSuccessAndError(API_URL);
    };

    this.getVersionSummary = function (version, artifactId, groupId, event) {
      API_URL = serverApiUrl.VER_SUM_API_URL_PREFIX + version + '&artifactId=' + artifactId + '&groupId=' + groupId + '&event=' + event;
      return runHttpGetSuccessAndError(API_URL);
    };

    this.getArtifactVersions = function (artifactId, groupId) {
      API_URL = serverApiUrl.ARTIFACT_VERS_API_URL_PREFIX + artifactId + '&groupId=' + groupId;
      return runHttpGetSuccessAndError(API_URL);
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('basicTestInfoServerApi', BasicTestInfoServerApi);

})();
