'use strict';

(function () {

  /* @ngInject */
  function ArtifactsTablesEntity(postPlayUtils) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;
    this.failedAndChosenWrappedArtifacts = [];
    this.allWrappedArtifacts = [];
    this.addToFailedAndChosenTable = function (obj) {
      self.failedAndChosenWrappedArtifacts.push(obj);
    };
    this.removeFromFailedAndChosenTable = function (objToRemove) {
      self.failedAndChosenWrappedArtifacts = postPlayUtils.filter(self.failedAndChosenWrappedArtifacts, objToRemove);
    };
    this.addToAllArtifactsTable = function (obj) {
      self.allWrappedArtifacts.push(obj);
    };
    this.removeFromAllArtifactsTable = function (objToRemove) {
      self.allWrappedArtifacts = postPlayUtils.filter(self.allWrappedArtifacts, objToRemove);
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('artifactsTablesEntity', ArtifactsTablesEntity);

})();
