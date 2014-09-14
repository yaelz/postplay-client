'use strict';

(function () {

  /* @ngInject */
  function DashboardServerApi($http, serverApiUrl) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var currentlyRunningTests = {};
    var fieldMap = {};

    // Public API here
    this.getCurrentlyRunningTests = function () {
      return runHttpSuccessAndError(serverApiUrl.CURRENTLY_RUNNING_TESTS_API_URL, currentlyRunningTests);
    };
    this.getFieldMap = function () {
      return runHttpSuccessAndError(serverApiUrl.FIELD_MAP_API_URL, fieldMap);
    };
    function runHttpSuccessAndError(API_URL, destinationVariable) {
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
    .service('dashboardServerApi', DashboardServerApi);

})();
