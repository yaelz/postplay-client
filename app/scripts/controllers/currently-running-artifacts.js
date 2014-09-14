'use strict';

(function () {

  /* @ngInject */
  function CurrentlyRunningArtifactsController(_basicTestInfoServerApi_) {
    var self = this;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;
    this.currentlyRunningArtifacts = [];
    function updateCurrentlyRunningArtifacts() {
//      console.log('in currently running artifacts!');
      self.currentlyRunningArtifacts = self.basicTestInfoServerApi.getCurrentlyRunningArtifacts();
    }

    updateCurrentlyRunningArtifacts();
  }

  angular
    .module('postplayTryAppInternal')
    .controller('CurrentlyRunningArtifactsController', CurrentlyRunningArtifactsController);

})();
