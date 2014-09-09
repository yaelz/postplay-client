'use strict';

(function () {

  /* @ngInject */
  function MainController($scope, $timeout, versionTestResults) {
    var that = this;
//    this.serverTableHeadlines = ['Status', 'Server', 'Execution', 'Execution status', 'Build event'];
    this.serverTableHeadlines = ['Server', 'Execution', 'Execution status', 'Build event'];
    this.artifacts = [];
    this.currentArtifactId = '';
    this.currentArtifactGroupId = '';
    this.currentArtifactVersions = [];
    this.currentArtifactVersionSummary = {};
    this.currentArtifactDataIsUpdated = false;
    this.updateCurrentArtifactData = function () {
      if (this.currentArtifactId !== '') {
        var currentArtifact = getArtifactByArtifactId(this.currentArtifactId);
        this.currentArtifactGroupId = currentArtifact.groupId;
        this.currentArtifactVersions = versionTestResults.getArtifactVersions(this.currentArtifactId, this.currentArtifactGroupId);
        $timeout(function () {
          that.currentArtifactVersionSummary = versionTestResults.getVersionSummary(that.currentArtifactVersions[0], that.currentArtifactId, that.currentArtifactGroupId);
          // TODO is this time enough to get data from the server?
        }, 100);
      }
      this.currentArtifactDataIsUpdated = true; //TODO test with e2e
    };

    function getArtifactByArtifactId(artifactId) {
      var currArtifact;
      for (var i = 0; i < that.artifacts.length; i++) {
        currArtifact = that.artifacts[i];
        if (currArtifact.artifactId === artifactId)  {
          return currArtifact;
        }
      }
    }

    function init() {
      that.artifacts = versionTestResults.getAllArtifacts();
    }

    init();
  }

  angular
    .module('postplayTryAppInternal')
    .controller('MainController', MainController);

})();
