'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController(_allArtifactsFreshener_, $scope) {
    this.allArtifactsFreshener = _allArtifactsFreshener_;
    var self = this;
    this.currentArtifactToAdd = '';
    $scope.failingArtifacts = [];
    $scope.passingArtifacts = [];
    $scope.getAllArtifacts = {
      data: 'failingArtifacts',
      columnDefs: [
        { field: 'testStatusEnum', width: '5px', displayName: '', cellTemplate: 'views/basic-test-info-color-template-servers.html'},
        { field: 'pinned', width: '5px', displayName: '', cellTemplate: 'views/basic-test-info-color-template-servers.html'},
        { field: 'artifactId', width: '35%', displayName: 'Artifact Id', cellTemplate: '<div class="ngCellText col1 colt1 artifact-id" ng-class="col.colIndex()" popover="{{row.entity.artifactId}}, {{row.entity.groupId}}" popover-trigger="mouseenter" popover-placement="right" popover-append-to-body="true"><span ng-cell-text>{{row.entity.artifactId}}</span></div>'},
        { field: 'version', width: '20%', displayName: 'Version'},
        { field: 'event', width: '20%', displayName: 'Event'},
        { field: 'startTime', width: '20%', displayName: 'Start Time', cellFilter: 'date:\'d/M/yy H:mm\'' }
      ],
      multiSelect: false
    };

    function callback(artifacts) {
      $scope.failingArtifacts = artifacts.failing;
      $scope.passingArtifacts = artifacts.passing;
    }

    $scope.addArtifactById = function () {
      self.allArtifactsFreshener.getAllArtifacts(callback, $scope.currentArtifactToAdd);
//      var inputChangedPromise;
//      if(inputChangedPromise){
//        $timeout.cancel(inputChangedPromise);
//      }
//      inputChangedPromise = $timeout(self.allArtifactsFreshener.getAllArtifacts(callback, $scope.currentArtifactToAdd), 1000);
    };
    $scope.clearInput = function () {
      $scope.currentArtifactToAdd = '';
    };
    this.allArtifactsFreshener.getAllArtifacts(callback);
  }

  angular
    .module('postplayTryAppInternal')
    .controller('BasicTestInfoController', BasicTestInfoController);

})();
