'use strict';

(function () {

  /* @ngInject */
  function CurrentlyRunningController(_basicTestInfoServerApi_) {
    var self = this;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;
    this.currentlyRunningArtifacts = [];
    function updateCurrentlyRunningArtifacts() {
      self.currentlyRunningArtifacts = self.basicTestInfoServerApi.getCurrentlyRunningArtifacts();
    }

    updateCurrentlyRunningArtifacts();
  }

  angular
    .module('postplayTryAppInternal')
    .controller('CurrentlyRunningController', CurrentlyRunningController);

})();
