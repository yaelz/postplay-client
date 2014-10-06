'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController(_basicTestInfoServerApi_) {
    var self = this;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;

    this.serverTableTitles = ['Server', 'Execution', 'Execution status', 'Build event'];
    this.artifacts = [];
    this.versionSummary = [];
    this.isDataLoaded = false;

    this.serversTestResultsSummary = {
      data: 'basicTestInfoCtrl.versionSummary',
      columnDefs: [
        { field: 'artifactId', width: '40%', displayName: 'Artifact Id'},
        { field: 'server', width: '40%', displayName: 'Server'},
        { field: 'analysisResultStatus', width: '20%', displayName: 'Analysis Result Status'}
      ],
      multiSelect: false,
      rowTemplate: '' +
        '<div style="height: 100%" >' +
          '<div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell">' +
            '<a href="#artifactId/{{row.entity.artifactId}}/server/{{row.entity.server}}/groupId/{{row.entity.groupId}}">' +
            '<div ng-cell>' +
            '</div>' +
          '</div>' +
        '</div>'
    };
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
    function didServerRunEndWithTestStatus(serverRunInfo, statusEnum) {
      return serverRunInfo.testStatusEnum === statusEnum;
    }
    function initArtifacts() {
      self.artifacts = [];
      return self.basicTestInfoServerApi.getAllArtifacts().then(function (response) {
        angular.copy(response.data, self.artifacts);
      });
    }
    function getArtifactsDataFromService() {
      initArtifacts().then(function () {
        self.artifacts.forEach(function (currentArtifact) {
          self.basicTestInfoServerApi.getArtifactVersions(currentArtifact.artifactId, currentArtifact.groupId)
            .then(function (response) {
              var latestVersion = response.data[0];
              self.basicTestInfoServerApi.getVersionSummary(latestVersion, currentArtifact.artifactId, currentArtifact.groupId)
                .then(function (response) {
                  response.data.responseBody.forEach(function (versionSummaryOfCurrent) {
                    self.versionSummary.push(versionSummaryOfCurrent);
                  });
                });
            });
        });
        self.isDataLoaded = true;
      });
    }
    getArtifactsDataFromService();
  }

  angular
    .module('postplayTryAppInternal')
    .controller('BasicTestInfoController', BasicTestInfoController);

})();
