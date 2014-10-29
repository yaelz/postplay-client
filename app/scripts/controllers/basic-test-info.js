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
      { field: 'artifactData.testStatusEnum', width: '5%', displayName: '', cellTemplate: 'views/basic-test-info-image-template.html'},
      { field: 'artifactData.artifactId', width: '35%', displayName: 'Artifact Id', cellTemplate: '<div class="ngCellText" popover="{{row.entity.artifactData.artifactId}}" popover-trigger="mouseenter" popover-placement="right" popover-append-to-body="true"><span ng-cell-text>{{row.entity.artifactData.artifactId}}</span></div>'},
      { field: 'artifactData.version', width: '20%', displayName: 'Version'},
      { field: 'artifactData.event', width: '20%', displayName: 'Event'},
      { field: 'artifactData.startTime', width: '20%', displayName: 'Start Time', cellFilter: 'date:\'d/M/yy H:mm\'' }
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

    function onRowClick(selectedRow) {
      self.serversFromClickedOnArtifacts = selectedRow.entity.artifactData.servers;
      self.artifactIsClickedOn = true;
      self.clickedOnArtifact = {
        artifactId: selectedRow.entity.artifactData.artifactId,
        groupId: selectedRow.entity.artifactData.groupId,
        version: selectedRow.entity.artifactData.version,
        event: selectedRow.entity.artifactData.event
      };
      return true;
    }
    this.failedArtifactsSummary = {
      data: 'basicTestInfoCtrl.failedVersionSummary',
      init: initGrid,
      columnDefs: 'basicTestInfoCtrl.columnDefsForGrids',
      multiSelect: false,
      beforeSelectionChange: onRowClick
//      rowTemplate: 'views/basic-test-info-row-template.html'
    };
    this.chosenArtifactsSummary = {
      data: 'basicTestInfoCtrl.chosenVersionSummary',
      init: initGrid,
      columnDefs: 'basicTestInfoCtrl.columnDefsForGrids',
      multiSelect: false,
      beforeSelectionChange: onRowClick
//      rowTemplate: 'views/basic-test-info-row-template.html'
    };
    this.serversToShow = {
      data: 'basicTestInfoCtrl.serversFromClickedOnArtifacts',
      init: initGrid,
      columnDefs: [
        { field: 'artifactData.analysisResultStatus', width: '5%', displayName: '', cellTemplate: 'views/basic-test-info-image-template.html'},
        { field: 'ip', width: '95%', displayName: 'IP'}
      ],
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
      this.allVersionSummary.forEach(function (currentVersionSummaryWrapper) {
        if (self.currentArtifactId === currentVersionSummaryWrapper.artifactData.artifactId && !currentVersionSummaryWrapper.isChosen && !currentVersionSummaryWrapper.hasFailedServer) {
          self.chosenVersionSummary.push(currentVersionSummaryWrapper);
          currentVersionSummaryWrapper.isChosen = true;
          self.artifactsWereChosen = true;
        }
      });
    };

    function didServerRunEndWithTestStatus(serverRunInfo, statusEnum) {
      return serverRunInfo.testStatusEnum === statusEnum;
    }
    function initArtifacts() {
      return self.basicTestInfoServerApi.getAllArtifacts().then(function (response) {
        self.artifacts = response.data;
      });
    }
    function initFailedArtifacts() {
      return self.basicTestInfoServerApi.getAllFailedArtifacts().then(function (response) {
        self.failedArtifacts = response.data;
      });
    }
    function artifactHoldsFailedServer(responseBody) {
      var foundFailedServer = false;
      responseBody.servers.forEach(function (currServerData) {
        if (currServerData.analysisResultStatus === 'TEST_FAILED') {
          foundFailedServer = true;
        }
      });
      return foundFailedServer;
    }
    function getArtifactsDataFromService() {

      initFailedArtifacts().then(function () {
        self.failedVersionSummary = [];
        self.failedArtifacts.forEach(function (currentArtifact) {
          var latestVersion = currentArtifact.version;
          self.basicTestInfoServerApi.getVersionSummary(latestVersion, currentArtifact.artifactId, currentArtifact.groupId, currentArtifact.event)
            .then(function (response) {
              var versionSummaryWrapper = {artifactData: response.data.responseBody, hasFailedServer: true, isChosen: false};
              self.failedVersionSummary.push(versionSummaryWrapper);
            });
        });
      });
      initArtifacts().then(function () {
        var newAllVersionSummary = [];
        self.artifacts.forEach(function (currentArtifact) {
          var latestVersion = currentArtifact.version;
          self.basicTestInfoServerApi.getVersionSummary(latestVersion, currentArtifact.artifactId, currentArtifact.groupId, currentArtifact.event)
            .then(function (response) {
              var versionSummaryWrapper = {artifactData: response.data.responseBody, hasFailedServer: false, isChosen: false};
              newAllVersionSummary.push(versionSummaryWrapper);
              if (artifactHoldsFailedServer(versionSummaryWrapper.artifactData)) {
                versionSummaryWrapper.hasFailedServer = true;
              }
              self.allVersionSummary = newAllVersionSummary;
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
