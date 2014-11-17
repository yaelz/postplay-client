'use strict';

(function () {

  /* @ngInject */
  function AllArtifactsController(allArtifactsFreshener, serverOptionsColumnDefs, artifactsOptionsColumnDefs, $scope, $timeout) {
    this.currentArtifactToAdd = '';
    $scope.artifactIsClickedOn = false;
    $scope.statusColorMap = {FAILED: 'failed', PASSED: 'passed', WARNING: 'warning'};
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
      allArtifactsFreshener.getVersionSummary($scope.clickedOnArtifact)
        .then(function (response) {
          $scope.versionSummary = response;
        });
      return true;
    };
    $scope.artifactsOptions = {
      data: 'failingArtifacts',
      columnDefs: artifactsOptionsColumnDefs,
      multiSelect: false,
      beforeSelectionChange: onRowClick
    };
    $scope.serversOptions = {
      data: 'versionSummary',
      columnDefs: serverOptionsColumnDefs,
      init: initGrid,
      multiSelect: false,
      rowTemplate: 'views/all-artifacts-row-template.html'
    };

    $scope.addArtifactById = function () {
      var artifacts = allArtifactsFreshener.updateChosenArtifact($scope.currentArtifactToAdd);
      $scope.failingArtifacts = artifacts.failing;
      $scope.passingArtifacts = artifacts.passing;
    };
    $scope.clearInput = function () {
      $scope.currentArtifactToAdd = '';
    };
    allArtifactsFreshener.getAllArtifacts()
      .then(function (artifacts) {
        $scope.failingArtifacts = artifacts.failing;
        $scope.passingArtifacts = artifacts.passing;
      });
  }

  angular
    .module('postplayTryAppInternal')
    .constant('serverOptionsColumnDefs', [
      { field: 'server', width: '60%', displayName: 'IP'},
      { field: 'analysisResultStatus', width: '40%', displayName: 'Status'}
    ])
    .constant('artifactsOptionsColumnDefs', [
      { field: 'testStatusEnum', width: '5px', displayName: '', cellTemplate: 'views/all-artifacts-color-template.html'},
//      { field: 'pinned', width: '5px', displayName: '', cellTemplate: 'views/all-artifacts-color-template-servers.html'},
      { field: 'artifactId', width: '35%', displayName: 'Artifact Id', cellTemplate: '<div class="ngCellText col1 colt1 artifact-id" ng-class="col.colIndex()" popover="{{row.entity.artifactId}}, {{row.entity.groupId}}" popover-trigger="mouseenter" popover-placement="right" popover-append-to-body="true"><span ng-cell-text>{{row.entity.artifactId}}</span></div>'},
      { field: 'version', width: '20%', displayName: 'Version'},
      { field: 'event', width: '20%', displayName: 'Event'},
      { field: 'startTime', width: '20%', displayName: 'Start Time', cellFilter: 'date:\'d/M/yy H:mm\'' }
    ])
    .controller('AllArtifactsController', AllArtifactsController);

})();
