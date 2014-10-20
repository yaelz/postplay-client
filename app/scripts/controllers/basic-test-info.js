'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController(_basicTestInfoServerApi_, $timeout) {
    var self = this;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;

    this.serverTableTitles = ['Server', 'Execution', 'Execution status', 'Build event'];
    this.artifacts = [];
    this.allVersionSummary = [];
    this.failedVersionSummary = [];
    this.chosenVersionSummary = [];
    this.artifactsWereChosen = false;
    this.isDataLoaded = false;

    this.failedArtifactsSummary = {
      data: 'basicTestInfoCtrl.allVersionSummary',
      init: function (gridCtrl, gridScope) {
        gridScope.$on('ngGridEventData', function () {
          $timeout(function () {
            angular.forEach(gridScope.columns, function (col) {
              gridCtrl.resizeOnData(col);
            });
          });
        });
      },
      columnDefs: [
        { field: 'artifactId', width: '70%', displayName: 'Artifact Id'},
        { field: 'testStatusEnum', width: '30%', displayName: 'Tests Status', cellTemplate: 'views/basic-test-info-image-template.html'}
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
    this.chosenArtifactsSummary = {
      data: 'basicTestInfoCtrl.chosenVersionSummary',
      init: function (gridCtrl, gridScope) {
        gridScope.$on('ngGridEventData', function () {
          $timeout(function () {
            angular.forEach(gridScope.columns, function (col) {
              gridCtrl.resizeOnData(col);
            });
          });
        });
      },
      columnDefs: [
        { field: 'artifactId', width: '70%', displayName: 'Artifact Id'},
        { field: 'testStatusEnum', width: '30%', displayName: 'Tests Status', cellTemplate: 'views/basic-test-info-image-template.html'}
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

    this.updateChosenArtifactData = function () {
      this.allVersionSummary.forEach(function (currentVersionSummary) {
        if (self.currentArtifactId === currentVersionSummary.artifactId && chosenVersionSummaryDoesntHave(currentVersionSummary)) {
          self.chosenVersionSummary.push(currentVersionSummary);
        }
      });
      this.artifactsWereChosen = true;
    };
    function chosenVersionSummaryDoesntHave(currentVersionSummary) {
      return self.chosenVersionSummary.every(function (versionSummary) {
        return versionSummary.artifactId !== currentVersionSummary.artifactId;
      });
    }
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
                  response.data.responseBody.forEach(function (responseBodyOfCurrent) {
                    self.allVersionSummary.push(responseBodyOfCurrent);
//                    if (responseBodyOfCurrent.testStatusEnum !== 'STATUS_COMPLETED_SUCCESSFULLY') {
//                      self.failedVersionSummary.push(responseBodyOfCurrent);
//                    }
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
