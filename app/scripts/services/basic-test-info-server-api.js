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
    var self = this;
    var API_URL;

    function httpGetSuccessAndError(API_URL, destinationVariable) {
      $http.get(API_URL)
        .success(function (response) {
          self.thereWasServerError = false;
          angular.copy(response, destinationVariable);
        })
        .error(function () {
          self.thereWasServerError = true;
//          $window.alert('Something went wrong trying to get the lifecycle artifact versions');
        });
      return destinationVariable;
    }
    // Public API here
    this.getAllArtifacts = function () {
//      allArtifacts = [];
      API_URL = '/_api/getAllArtifacts';
      return httpGetSuccessAndError(API_URL, allArtifacts);
    };

    this.getLifecycleBuilds = function () {
      allLifeCycleBuilds = {};
      API_URL = '/_api/getLifecycleBuilds';
      return httpGetSuccessAndError(API_URL, allLifeCycleBuilds);
    };

    this.getVersionSummary = function (version, artifactId, groupId) {
      versionSummary = {};
      API_URL = '/_api/versionSummary/json?version=' + version + '&artifactId=' + artifactId + '&groupId=' + groupId;
      return httpGetSuccessAndError(API_URL, versionSummary);
    };

    this.getArtifactVersions = function (artifactId, groupId) {
      artifactVersions = [];
      API_URL = '/_api/getArtifactVersions/json?artifactId=' + artifactId + '&groupId=' + groupId;
      return httpGetSuccessAndError(API_URL, artifactVersions);
    };

    this.getCurrentlyRunningArtifacts = function () {
      currentlyRunningArtifacts = [];
      API_URL = '/_api/getCurrentlyRunningArtifacts/json';
      return httpGetSuccessAndError('/_api/getCurrentlyRunningArtifacts/json', currentlyRunningArtifacts);
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('basicTestInfoServerApi', BasicTestInfoServerApi);

})();
