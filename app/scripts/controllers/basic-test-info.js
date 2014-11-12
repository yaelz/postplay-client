'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController(_allArtifactsFreshener_, $scope) {
    this.allArtifactsFreshener = _allArtifactsFreshener_;
    var self = this;
    this.currentArtifactToAddToTable = '';
    $scope.getAllArtifacts = {
      data: 'basicTestInfoCtrl.failingArtifacts',
      columnDefs: [
        { field: 'testStatusEnum', width: '5px', displayName: '', cellTemplate: 'views/basic-test-info-color-template-servers.html'},
        { field: 'artifactId', width: '35%', displayName: 'Artifact Id', cellTemplate: '<div class="ngCellText col1 colt1 artifact-id" ng-class="col.colIndex()"><span ng-cell-text>{{row.entity.artifactId}}</span></div>'},
        { field: 'version', width: '20%', displayName: 'Version'},
        { field: 'event', width: '20%', displayName: 'Event'},
        { field: 'startTime', width: '20%', displayName: 'Start Time', cellFilter: 'date:\'d/M/yy H:mm\'' }
      ],
      multiSelect: false
    };

//    this.updateChosenArtifactDataToAdd = function () {
//      this.allArtifactsFreshener.updateChosenArtifact($scope.currentArtifactToAddToTable.split(','));
//    };

    self.failingArtifacts = [];
    $scope.passingArtifacts = [];

    this.allArtifactsFreshener.getAllArtifacts(function (artifacts) {
      self.failingArtifacts = artifacts.failing;
      $scope.passingArtifacts = artifacts.passing;
    });
  }

  angular
    .module('postplayTryAppInternal')
    .controller('BasicTestInfoController', BasicTestInfoController);

})();
