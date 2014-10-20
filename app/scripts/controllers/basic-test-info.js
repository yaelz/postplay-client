'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController(_basicTestInfoServerApi_, $timeout, $scope, $interval) {
    var self = this;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;

    this.chosenVersionSummary = [];
    this.artifactsWereChosen = false;
    this.serverTableTitles = ['Server', 'Execution', 'Execution status', 'Build event'];
    this.columnDefsForGrids = [
      { field: 'artifactId', width: '70%', displayName: 'Artifact Id'},
      { field: 'testStatusEnum', width: '30%', displayName: 'Tests Status', cellTemplate: 'views/basic-test-info-image-template.html'}
    ];

    function initGrid(gridCtrl, gridScope) {
      gridScope.$on('ngGridEventData', function () {
        $timeout(function () {
          angular.forEach(gridScope.columns, function (col) {
            gridCtrl.resizeOnData(col);
          });
        });
      });
    }
    this.failedArtifactsSummary = {
      data: 'basicTestInfoCtrl.failedVersionSummary',
      init: initGrid,
      columnDefs: 'basicTestInfoCtrl.columnDefsForGrids',
      multiSelect: false,
      rowTemplate: 'views/basic-test-info-row-template.html'
    };
    this.chosenArtifactsSummary = {
      data: 'basicTestInfoCtrl.chosenVersionSummary',
      init: initGrid,
      columnDefs: 'basicTestInfoCtrl.columnDefsForGrids',
      multiSelect: false,
      rowTemplate: 'views/basic-test-info-row-template.html'
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
        if (self.currentArtifactId === currentVersionSummary.artifactId && chosenVersionSummaryDoesntHave(currentVersionSummary) && failedVersionSummaryDoesntHave(currentVersionSummary)) {
          self.chosenVersionSummary.push(currentVersionSummary);
          self.artifactsWereChosen = true;
        }
      });
    };

    function chosenVersionSummaryDoesntHave(currentVersionSummary) {
      return self.chosenVersionSummary.every(function (versionSummary) {
        return versionSummary.artifactId !== currentVersionSummary.artifactId;
      });
    }
    function failedVersionSummaryDoesntHave(currentVersionSummary) {
      return self.failedVersionSummary.every(function (versionSummary) {
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
      var newAllVersionSummary = [];
      initArtifacts().then(function () {
        self.failedVersionSummary = [];
        self.artifacts.forEach(function (currentArtifact) {
          self.basicTestInfoServerApi.getArtifactVersions(currentArtifact.artifactId, currentArtifact.groupId)
            .then(function (response) {
              var latestVersion = response.data[0];
              self.basicTestInfoServerApi.getVersionSummary(latestVersion, currentArtifact.artifactId, currentArtifact.groupId)
                .then(function (response) {
                  response.data.responseBody.forEach(function (responseBodyOfCurrent) {
                    newAllVersionSummary.push(responseBodyOfCurrent);
                    if (responseBodyOfCurrent.testStatusEnum !== 'STATUS_COMPLETED_SUCCESSFULLY') {
                      self.failedVersionSummary.push(responseBodyOfCurrent);
                    }
                  });
                  self.allVersionSummary = newAllVersionSummary;
                });
            });
        });
      });
    }
    getArtifactsDataFromService();
    this.REFRESH_TIME = 5 * 60 * 1000; // five minutes
    this.promise = $interval(getArtifactsDataFromService, this.REFRESH_TIME);

// Cancel interval on page changes
    $scope.$on('$destroy', function () {
      if (angular.isDefined(self.promise)) {
        $interval.cancel(self.promise);
        self.promise = undefined;
      }
    });
  }

  angular
    .module('postplayTryAppInternal')
    .controller('BasicTestInfoController', BasicTestInfoController);

})();
