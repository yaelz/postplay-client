'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController(_basicTestInfoServerApi_, $scope, $interval, _postPlayUtils_, _artifactsTablesEntity_, _allArtifactsFreshener_) {
    var self = this;
    this.artifactsTablesEntity = _artifactsTablesEntity_;
    this.allArtifactsFreshener = _allArtifactsFreshener_;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;
    this.postPlayUtils = _postPlayUtils_;
    this.allArtifactWrappers = [];
    this.failedAndChosenArtifacts = [];
    this.serverTableTitles = ['Server', 'Execution', 'Execution status', 'Build event'];
    this.columnDefsForArtifactsGrid = [
      { field: 'artifactData.testStatusEnum', width: '5px', displayName: '', cellTemplate: 'views/basic-test-info-color-template-servers.html'},
      { field: 'artifactData.artifactId', width: '35%', displayName: 'Artifact Id', cellTemplate: '<div class="ngCellText" popover="{{row.entity.artifactData.artifactId}}, {{row.entity.artifactData.groupId}}" popover-trigger="mouseenter" popover-placement="right" popover-append-to-body="true"><span ng-cell-text>{{row.entity.artifactData.artifactId}}</span></div>'},
      { field: 'artifactData.version', width: '20%', displayName: 'Version'},
      { field: 'artifactData.event', width: '20%', displayName: 'Event'},
      { field: 'artifactData.startTime', width: '20%', displayName: 'Start Time', cellFilter: 'date:\'d/M/yy H:mm\'' }
    ];

    function setAllVariablesForRowClick(artifactData) {
      self.artifactIsClickedOn = true;
      self.clickedOnArtifact = {
        artifactId: artifactData.artifactId,
        groupId: artifactData.groupId,
        version: artifactData.version,
        event: artifactData.event
      };
      self.basicTestInfoServerApi.getVersionSummary(artifactData.version, artifactData.artifactId, artifactData.groupId, artifactData.event).then(function (response) {
        self.serversFromClickedOnArtifacts = response.data;
      });
    }

    this.onRowClick = function (selectedRow) {
      var artifactData = selectedRow.entity.artifactData;
      setAllVariablesForRowClick(artifactData);
      return true;
    };
    this.failedAndChosenArtifactsSummaryTableData = {
      data: 'basicTestInfoCtrl.artifactsTablesEntity.failedAndChosenWrappedArtifacts',
//      init: initGrid,
      columnDefs: 'basicTestInfoCtrl.columnDefsForArtifactsGrid',
      multiSelect: false,
      beforeSelectionChange: self.onRowClick
    };
    this.serversToShow = {
      data: 'basicTestInfoCtrl.serversFromClickedOnArtifacts',
      columnDefs: [
        { field: 'analysisResultStatus', width: '5px', displayName: '', cellTemplate: 'views/basic-test-info-color-template-servers.html'},
        { field: 'server', displayName: 'IP'}
      ],
      multiSelect: false,
      rowTemplate: 'views/basic-test-info-row-template.html'
    };
    this.updateChosenArtifactDataToAddToTable = function () {
      self.allArtifactsFreshener.updateChosenArtifactDataToAddToTable(self.currentArtifactToAddToTable);
      self.currentArtifactToAddToTable = '';
    };
//    getArtifactsDataFromService();
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
