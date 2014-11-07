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
  }

  angular
    .module('postplayTryAppInternal')
    .service('postPlayUtils', PostPlayUtils);

})();
