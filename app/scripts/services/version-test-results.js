'use strict';

(function () {

  /* @ngInject */
  function VersionTestResults($http, $window) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var allArtifacts = [];
    var allLifeCycleBuilds = {};
    var versionSummary = {};
    var artifactVersions = [];
    var API_URL;

    // Public API here
    this.getAllArtifacts = function () {
      API_URL = '/_api/getAllArtifacts';
      $http.get(API_URL)
        .success(function (response) {
          angular.copy(response, allArtifacts);
        })
        .error(function () {
          $window.alert('Something went wrong trying to get the artifacts');
        });
      return allArtifacts;
    };

    this.getLifecycleBuilds = function () {
      API_URL = '/_api/getLifecycleBuilds';
      $http.get(API_URL)
        .success(function (response) {
          angular.copy(response, allLifeCycleBuilds);
        })
        .error(function () {
          $window.alert('Something went wrong trying to get the lifecycle builds');
        });
      return allLifeCycleBuilds;
    };

    this.getVersionSummary = function (version, artifactId, groupId) {
      API_URL = '/_api/versionSummary/json?version=' + version + '&artifactId=' + artifactId + '&groupId=' + groupId;
      $http.get(API_URL)
        .success(function (response) {
          angular.copy(response, versionSummary);
        })
        .error(function () {
          $window.alert('Something went wrong trying to get the versions summary');
        });
      return versionSummary;
    };

    this.getArtifactVersions = function (artifactId, groupId) {
      API_URL = '/_api/getArtifactVersions/json?artifactId=' + artifactId + '&groupId=' + groupId;
      $http.get(API_URL)
        .success(function (response) {
          angular.copy(response, artifactVersions);
        })
        .error(function () {
          $window.alert('Something went wrong trying to get the lifecycle artifact versions');
        });
      return artifactVersions;
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('versionTestResults', VersionTestResults);

})();
