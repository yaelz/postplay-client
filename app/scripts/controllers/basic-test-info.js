'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController(_allArtifactsFreshener_, $scope, $timeout) {
    this.allArtifactsFreshener = _allArtifactsFreshener_;
    var self = this;
    this.currentArtifactToAdd = '';
    $scope.artifactIsClickedOn = false;
    function initGrid(gridCtrl, gridScope) {
      gridScope.$on('ngGridEventData', function () {
        $timeout(function () {
          angular.forEach(gridScope.columns, function (col) {
            gridCtrl.resizeOnData(col);
          });
        });
      });
    }
    var onRowClick = function (selectedRow) {
      $scope.artifactIsClickedOn = true;
      $scope.clickedOnArtifact = selectedRow.entity;
      self.allArtifactsFreshener.getVersionSummary($scope.clickedOnArtifact, versionSummaryCallback);
      return true;
    };
    $scope.artifactsOptions = {
      data: 'failingArtifacts',
      columnDefs: [
        { field: 'testStatusEnum', width: '5px', displayName: '', cellTemplate: 'views/basic-test-info-color-template-servers.html'},
        { field: 'pinned', width: '5px', displayName: '', cellTemplate: 'views/basic-test-info-color-template-servers.html'},
        { field: 'artifactId', width: '35%', displayName: 'Artifact Id', cellTemplate: '<div class="ngCellText col1 colt1 artifact-id" ng-class="col.colIndex()" popover="{{row.entity.artifactId}}, {{row.entity.groupId}}" popover-trigger="mouseenter" popover-placement="right" popover-append-to-body="true"><span ng-cell-text>{{row.entity.artifactId}}</span></div>'},
        { field: 'version', width: '20%', displayName: 'Version'},
        { field: 'event', width: '20%', displayName: 'Event'},
        { field: 'startTime', width: '20%', displayName: 'Start Time', cellFilter: 'date:\'d/M/yy H:mm\'' }
      ],
      multiSelect: false,
      beforeSelectionChange: onRowClick
    };
    $scope.serversOptions = {
      data: 'versionSummary',
      columnDefs: [
        { field: 'server', width: '60%', displayName: 'IP'},
        { field: 'analysisResultStatus', width: '40%', displayName: 'Status'}
      ],
      init: initGrid,
      multiSelect: false,
      rowTemplate: 'views/basic-test-info-row-template.html'
    };

    function artifactsCallback(artifacts) {
      $scope.failingArtifacts = artifacts.failing;
      $scope.passingArtifacts = artifacts.passing;
    }

    function versionSummaryCallback(versionSummary) {
      $scope.versionSummary = versionSummary;
    }
    $scope.addArtifactById = function () {
      self.allArtifactsFreshener.getAllArtifacts(artifactsCallback, $scope.currentArtifactToAdd);
    };
    $scope.clearInput = function () {
      $scope.currentArtifactToAdd = '';
    };
    this.allArtifactsFreshener.getAllArtifacts(artifactsCallback);
  }

  angular
    .module('postplayTryAppInternal')
    .controller('BasicTestInfoController', BasicTestInfoController);

})();
