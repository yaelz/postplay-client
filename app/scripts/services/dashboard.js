'use strict';

(function () {

  /* @ngInject */
  function Dashboard($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var currentlyRunningTests = {};
    var fieldMap = {};

    // Public API here
    this.getCurrentlyRunningTests = function () {
      return runHttpSuccessAndError('/_api/getCurrentlyRunningTests/json', currentlyRunningTests);
    };

    this.getFieldMap = function () {
      return runHttpSuccessAndError('/_api/fieldMap', fieldMap);
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
    .service('dashboard', Dashboard);

})();
