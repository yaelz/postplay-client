'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController(_allArtifactsFreshener_) {
    this.allArtifactsFreshener = _allArtifactsFreshener_;
    var self = this;
    self.getAllArtifacts = {
      data: 'basicTestInfoCtrl.failingArtifacts',
      columnDefs: [
        { field: 'testStatusEnum', width: '5px', displayName: '', cellTemplate: 'views/basic-test-info-color-template-servers.html'},
        { field: 'artifactId', width: '35%', displayName: 'Artifact Id', cellTemplate: '<div class="ngCellText" popover="{{row.entity.artifactId}}, {{row.entity.groupId}}" popover-trigger="mouseenter" popover-placement="right" popover-append-to-body="true"><span ng-cell-text>{{row.entity.artifactId}}</span></div>'},
        { field: 'version', width: '20%', displayName: 'Version'},
        { field: 'event', width: '20%', displayName: 'Event'},
        { field: 'startTime', width: '20%', displayName: 'Start Time', cellFilter: 'date:\'d/M/yy H:mm\'' }
      ],
      multiSelect: false
    };
//    { field: 'artifactData.testStatusEnum', width: '5px', displayName: '', cellTemplate: 'views/basic-test-info-color-template-servers.html'},
//    { field: 'artifactData.artifactId', width: '35%', displayName: 'Artifact Id', cellTemplate: '<div class="ngCellText" popover="{{row.entity.artifactData.artifactId}}, {{row.entity.artifactData.groupId}}" popover-trigger="mouseenter" popover-placement="right" popover-append-to-body="true"><span ng-cell-text>{{row.entity.artifactData.artifactId}}</span></div>'},
//    { field: 'artifactData.version', width: '20%', displayName: 'Version'},
//    { field: 'artifactData.event', width: '20%', displayName: 'Event'},
//    { field: 'artifactData.startTime', width: '20%', displayName: 'Start Time', cellFilter: 'date:\'d/M/yy H:mm\'' }

    self.failingArtifacts = [];
    self.passingArtifacts = [];

    this.allArtifactsFreshener.getAllArtifacts(function (artifacts) {
      self.failingArtifacts = artifacts.failing;
      self.passingArtifacts = artifacts.passing;
    });
  }

  angular
    .module('postplayTryAppInternal')
    .controller('BasicTestInfoController', BasicTestInfoController);

})();
