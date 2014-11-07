'use strict';

(function () {

  /* @ngInject */
  function AllArtifactsFreshener(_basicTestInfoServerApi_) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;

    // Public API here
    function refreshAllArtifacts() {
      self.basicTestInfoServerApi.getAllArtifacts();
    }
    refreshAllArtifacts();
  }

  angular
    .module('postplayTryAppInternal')
    .service('allArtifactsFreshener', AllArtifactsFreshener);

})();
