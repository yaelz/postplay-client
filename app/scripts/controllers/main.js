'use strict';

(function () {

  /* @ngInject */
  function MainController($scope, versionTestResults) {
    var that = this;
    this.artifacts = [];
    this.currentArtifactId = '';
    this.currentArtifactVersion = '';
    this.updateCurrentArtifactVersion = function () {
      if (this.currentArtifactId !== '') {
        var currentArtifact = getArtifactByArtifactId(this.currentArtifactId);
        this.currentArtifactVersion = versionTestResults.getArtifactVersions(currentArtifact.artifactId, currentArtifact.groupId)[0];
      }
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
