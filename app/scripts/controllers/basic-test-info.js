'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController(_basicTestInfoServerApi_, $timeout, $scope, $interval) {
    var self = this;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;

    this.allArtifactWrappers = [];
    this.failedAndChosenArtifacts = [];
    this.serverTableTitles = ['Server', 'Execution', 'Execution status', 'Build event'];
    this.columnDefsForArtifactsGrid = [
      { field: 'artifactData.testStatusEnum', width: '5px', displayName: '', cellTemplate: 'views/basic-test-info-image-template.html'},
      { field: 'artifactData.artifactId', width: '35%', displayName: 'Artifact Id', cellTemplate: '<div class="ngCellText" popover="{{row.entity.artifactData.artifactId}}" popover-trigger="mouseenter" popover-placement="right" popover-append-to-body="true"><span ng-cell-text>{{row.entity.artifactData.artifactId}}</span></div>'},
      { field: 'artifactData.version', width: '20%', displayName: 'Version'},
      { field: 'artifactData.event', width: '20%', displayName: 'Event'},
      { field: 'artifactData.startTime', width: '20%', displayName: 'Start Time', cellFilter: 'date:\'d/M/yy H:mm\'' }
    ];

    function onRowClick(selectedRow) {
      var artifactData = selectedRow.entity.artifactData;
      self.serversFromClickedOnArtifacts = artifactData.servers;
      self.artifactIsClickedOn = true;
      self.clickedOnArtifact = {
        artifactId: artifactData.artifactId,
        groupId: artifactData.groupId,
        version: selectedRow.entity.artifactData.version,
        event: selectedRow.entity.artifactData.event
      };
      return true;
    }
    this.failedAndChosenArtifactsSummaryTableData = {
      data: 'basicTestInfoCtrl.failedAndChosenArtifacts',
//      init: initGrid,
      columnDefs: 'basicTestInfoCtrl.columnDefsForArtifactsGrid',
      multiSelect: false,
      beforeSelectionChange: onRowClick
    };
    this.serversToShow = {
      data: 'basicTestInfoCtrl.serversFromClickedOnArtifacts',
      columnDefs: [
        { field: 'artifactData.analysisResultStatus', width: '5px', displayName: '', cellTemplate: 'views/basic-test-info-image-template.html'},
        { field: 'ip', displayName: 'IP'}
      ],
      multiSelect: false,
      rowTemplate: 'views/basic-test-info-row-template.html'
    };

//    this.updateChosenArtifactDataToAddToTable = function () {
//      function isCurrentlyChosenArtifactANDIsntFailedANDHasNotBeenChosenBefore(currentVersionSummaryWrapper) {
//        return currentVersionSummaryWrapper.artifactData.artifactId === self.currentArtifactId && !currentVersionSummaryWrapper.isChosen && !currentVersionSummaryWrapper.hasFailedServer;
//      }
//
//      this.allVersionSummary.forEach(function (currentVersionSummaryWrapper) {
//        if (isCurrentlyChosenArtifactANDIsntFailedANDHasNotBeenChosenBefore(currentVersionSummaryWrapper)) {
//          self.failedAndChosenArtifacts.unshift(currentVersionSummaryWrapper);
//          currentVersionSummaryWrapper.isChosen = true;
//        }
//      });
//    };

    function getArtifactsDataFromService() {
      self.basicTestInfoServerApi.getAllArtifacts().then(function (response) {
        self.allArtifactWrappers = [];
        response.data.forEach(function (currentArtifact) {
          var currentArtifactWrapped = {artifactData: currentArtifact, isChosen: false, status: currentArtifact.analysisResultEnum};
          if (currentArtifactWrapped.status === 'TEST_FAILED') {
            self.failedAndChosenArtifacts.push(currentArtifactWrapped);
          }
          self.allArtifactWrappers.push(currentArtifactWrapped);
        });
      });
    }
    getArtifactsDataFromService();
//    this.REFRESH_TIME = 5 * 60 * 1000; // five minutes
//    this.promise = $interval(getArtifactsDataFromService, this.REFRESH_TIME);

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
