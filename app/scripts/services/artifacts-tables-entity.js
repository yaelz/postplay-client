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
    this.addToBeginningOfFailedAndChosenArtifactsTable = function (obj) {
      self.failedAndChosenWrappedArtifacts.unshift(obj);
    };
    this.addToPassedArtifactsTable = function (obj) {
      self.passedWrappedArtifacts.push(obj);
    };
    this.removeFromPassedArtifactsTable = function (objToRemove) {
      self.passedWrappedArtifacts = postPlayUtils.filter(self.passedWrappedArtifacts, objToRemove);
    };
    this.removeFromPassedArtifactsTableByArtifactId = function (artifactIdOfObjToRemove) {
      var removedObj;
      self.passedWrappedArtifacts = self.passedWrappedArtifacts.filter(function (passedArtifactWrapper) {
        if (passedArtifactWrapper.artifactData.artifactId === artifactIdOfObjToRemove) {
          removedObj = passedArtifactWrapper;
          return false;
        } else {
          return true;
        }
      });
      return removedObj;
    };
    this.artifactExistsInPassedArray = function (artifactData) {
      var found = false;
      self.passedWrappedArtifacts.forEach(function (oldArtifactForUI) {
        if (oldArtifactForUI.artifactData.artifactId === artifactData.artifactId) {
          found = true;
        }
      });
      return found;
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('artifactsTablesEntity', ArtifactsTablesEntity);

})();
