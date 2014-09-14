'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoServerApi($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var allArtifacts = [];
    var allLifeCycleBuilds = {};
    var versionSummary = {};
    var artifactVersions = [];
    var currentlyRunningArtifacts = [];
    this.thereWasServerError = false;
    this.serverErrors = {errorGettingRunningArtifacts: false};
    var self = this;
    var API_URL;

    function runHttpGetSuccessAndError(API_URL, destinationVariable) {
      $http.get(API_URL)
        .success(function (response) {
          self.thereWasServerError = false;
//          if (relevantError) {
//            self.serverErrors[relevantError] = false;
//          }
          angular.copy(response, destinationVariable);
        })
        .error(function () {
          self.thereWasServerError = true;
//          $window.alert('Something went wrong trying to get the lifecycle artifact versions');
//          if (relevantError) {
//            self.serverErrors[relevantError] = true;
//          }
        });
      return destinationVariable;
    }
    // Public API here
    this.getAllArtifacts = function () {
//      allArtifacts = [];
      API_URL = '/_api/getAllArtifacts';
      return runHttpGetSuccessAndError(API_URL, allArtifacts);
    };

    this.getLifecycleBuilds = function () {
      allLifeCycleBuilds = {};
      API_URL = '/_api/getLifecycleBuilds';
      return runHttpGetSuccessAndError(API_URL, allLifeCycleBuilds);
    };

    this.getVersionSummary = function (version, artifactId, groupId) {
      versionSummary = {};
      API_URL = '/_api/versionSummary/json?version=' + version + '&artifactId=' + artifactId + '&groupId=' + groupId;
      return runHttpGetSuccessAndError(API_URL, versionSummary);
    };

    this.getArtifactVersions = function (artifactId, groupId) {
      artifactVersions = [];
      API_URL = '/_api/getArtifactVersions/json?artifactId=' + artifactId + '&groupId=' + groupId;
      return runHttpGetSuccessAndError(API_URL, artifactVersions);
    };

    this.getCurrentlyRunningArtifacts = function () {
      currentlyRunningArtifacts = [];
      API_URL = '/_api/getCurrentlyRunningArtifacts/json';
//      return runHttpGetSuccessAndError(API_URL, currentlyRunningArtifacts, 'errorGettingRunningArtifacts');
      $http.get(API_URL)
        .success(function (response) {
          self.thereWasServerError = false;
          self.serverErrors.errorGettingRunningArtifacts = false;
          angular.copy(response, currentlyRunningArtifacts);
        })
        .error(function () {
          self.thereWasServerError = true;
//          $window.alert('Something went wrong trying to get the lifecycle artifact versions');
          self.serverErrors.errorGettingRunningArtifacts = true;
        });
      return currentlyRunningArtifacts;
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('basicTestInfoServerApi', BasicTestInfoServerApi);

})();
