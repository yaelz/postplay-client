'use strict';

(function () {

  /* @ngInject */
  function ArtifactsTablesEntity(postPlayUtils) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var self = this;
    this.failedAndChosenWrappedArtifacts = [];
    this.passedWrappedArtifacts = [];
    this.addToFailedAndChosenTable = function (obj) {
      self.failedAndChosenWrappedArtifacts.push(obj);
    };
    this.removeFromFailedAndChosenTable = function (objToRemove) {
      self.failedAndChosenWrappedArtifacts = postPlayUtils.filter(self.failedAndChosenWrappedArtifacts, objToRemove);
    };
    this.addToPassedArtifactsTable = function (obj) {
      self.passedWrappedArtifacts.push(obj);
    };
    this.removeFromPassedArtifactsTable = function (objToRemove) {
      self.passedWrappedArtifacts = postPlayUtils.filter(self.passedWrappedArtifacts, objToRemove);
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('artifactsTablesEntity', ArtifactsTablesEntity);

})();
