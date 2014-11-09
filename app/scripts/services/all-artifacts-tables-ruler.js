'use strict';

(function () {

  /* @ngInject */
  function AllArtifactsTablesRuler(_artifactsTablesEntity_) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // Public API here
    this.artifactsTablesEntity = _artifactsTablesEntity_;
  }

  angular
    .module('postplayTryAppInternal')
    .service('allArtifactsTablesRuler', AllArtifactsTablesRuler);
})();
