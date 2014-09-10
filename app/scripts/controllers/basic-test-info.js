'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController($scope, $timeout, basicTestInfoServerApi) {
    var self = this;
    this.basicTestInfoServerApi = basicTestInfoServerApi;
    function initArtifactData() {
      self.currentArtifactGroupId = '';
      self.currentArtifactVersions = [];
      self.currentArtifactVersionSummary = {};
      self.currentArtifactDataIsUpdated = false;
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

    function init() {
      self.artifacts = basicTestInfoServerApi.getAllArtifacts();
    }

    this.updateCurrentArtifactData = function () {
      initArtifactData.call(self);
      if (self.currentArtifactId !== '') {
        var currentArtifact = getArtifactByArtifactId(self.currentArtifactId);
        self.currentArtifactGroupId = currentArtifact.groupId;
        self.currentArtifactVersions = basicTestInfoServerApi.getArtifactVersions(this.currentArtifactId, this.currentArtifactGroupId);
        $timeout(function () {
          self.currentArtifactVersionSummary = basicTestInfoServerApi.getVersionSummary(self.currentArtifactVersions[0], self.currentArtifactId, self.currentArtifactGroupId);
          // TODO is this enough time to get data from the server?
        }, 100);
        if (self.currentArtifactVersions !== []) {
          self.currentArtifactDataIsUpdated = true; //TODO test with e2e
        } else {
          self.currentArtifactDataIsUpdated = false;
        }
      }
    };
    this.serverTableHeadlines = ['Server', 'Execution', 'Execution status', 'Build event'];
    this.artifacts = [];
    this.currentArtifactId = '';
    init();
    initArtifactData();
  }

  angular
    .module('postplayTryAppInternal')
    .controller('BasicTestInfoController', BasicTestInfoController);

})();
