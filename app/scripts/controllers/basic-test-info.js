'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController($timeout, _basicTestInfoServerApi_) {
    var self = this;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;
    this.serverRunEndedWithError = function (serverInfo) {
      // TODO get possibilities
      return didServerRunEndWithTestStatus(serverInfo, 'STATUS_COMPLETED_WITH_ERRORS') || didServerRunEndWithTestStatus(serverInfo, 'INCOMPLETE');
    };
    this.serverRunEndedWithWarning = function (serverInfo) {
      return didServerRunEndWithTestStatus(serverInfo, 'STATUS_COMPLETED_WITH_WARNINGS');
    };
    this.serverRunEndedSuccessfully = function (serverInfo) {
      return didServerRunEndWithTestStatus(serverInfo, 'STATUS_COMPLETED_SUCCESSFULLY');
    };
    this.serverTableTitles = ['Server', 'Execution', 'Execution status', 'Build event'];
    this.artifacts = [];
    this.currentArtifactId = '';

    this.updateChosenArtifactData = function () {
//      initArtifactData.call(self);
      if (isThereAnArtifactChosen()) {
        getArtifactDataFromServer.call(self);
        //TODO this should be checked in some other way... Want to know if there was a server error. Or should I just show empty data in the worst case?
        if (self.currentArtifactVersions !== []) {
          self.currentArtifactDataIsUpdated = true; //TODO test with e2e
        } else {
          self.currentArtifactDataIsUpdated = false;
        }
      }
    };

    function initArtifacts() {
      self.artifacts = self.basicTestInfoServerApi.getAllArtifacts();
    }
    function isThereAnArtifactChosen() {
      return self.currentArtifactId !== '';
    }
    function getArtifactDataFromServer() {
      var currentArtifact = getArtifactByArtifactId(self.currentArtifactId);
      self.currentArtifactGroupId = currentArtifact.groupId;
      self.currentArtifactVersions = self.basicTestInfoServerApi.getArtifactVersions(self.currentArtifactId, self.currentArtifactGroupId);
      $timeout(function () {
        self.currentArtifactVersionSummary = self.basicTestInfoServerApi.getVersionSummary(self.currentArtifactVersions[0], self.currentArtifactId, self.currentArtifactGroupId);
        // TODO is this enough time to get data from the server?
      }, 100);
    }
//    function initArtifactData() {
//      self.currentArtifactGroupId = '';
//      self.currentArtifactVersions = [];
//      self.currentArtifactVersionSummary = {};
//      self.currentArtifactDataIsUpdated = false;
//      //testStatusEnum
//    }
    function didServerRunEndWithTestStatus(serverRunInfo, statusEnum) {
      if (serverRunInfo.testStatusEnum === statusEnum) {
        return true;
      } else {
        return false;
      }
    }
    function getArtifactByArtifactId(artifactId) {
      var currArtifact;
      for (var i = 0; i < self.artifacts.length; i++) {
        currArtifact = self.artifacts[i];
        if (currArtifact.artifactId === artifactId)  {
          return currArtifact;
        }
      }
    }
    initArtifacts();
//    initArtifactData();
  }

  angular
    .module('postplayTryAppInternal')
    .controller('BasicTestInfoController', BasicTestInfoController);

})();
