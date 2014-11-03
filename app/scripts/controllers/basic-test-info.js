'use strict';

(function () {

  /* @ngInject */
  function BasicTestInfoController(_basicTestInfoServerApi_, $timeout, $scope, $interval) {
    var self = this;
    this.basicTestInfoServerApi = _basicTestInfoServerApi_;

    this.failedAndChosenArtifactsSummary = [];
    this.allVersionSummary = [];
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
      data: 'basicTestInfoCtrl.failedAndChosenArtifactsSummary',
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

    this.updateChosenArtifactData = function () {
      function isCurrentlyChosenArtifactANDIsntFailedANDHasNotBeenChosenBefore(currentVersionSummaryWrapper) {
        return currentVersionSummaryWrapper.artifactData.artifactId === self.currentArtifactId && !currentVersionSummaryWrapper.isChosen && !currentVersionSummaryWrapper.hasFailedServer;
      }

      this.allVersionSummary.forEach(function (currentVersionSummaryWrapper) {
        if (isCurrentlyChosenArtifactANDIsntFailedANDHasNotBeenChosenBefore(currentVersionSummaryWrapper)) {
          self.failedAndChosenArtifactsSummary.unshift(currentVersionSummaryWrapper);
          currentVersionSummaryWrapper.isChosen = true;
        }
      });
    };

    function initArtifacts() {
      return self.basicTestInfoServerApi.getAllArtifacts().then(function (response) {
        self.artifacts = response.data;
      });
    }

    function artifactsAreTheSameById(firstArtifact, secondArtifact) {
      return firstArtifact.artifactId === secondArtifact.artifactId;
    }
    function artifactsAreTheSameByIdVersionANDEvent(firstArtifact, secondArtifact) {
      return firstArtifact.artifactId === secondArtifact.artifactId && firstArtifact.version === secondArtifact.version && firstArtifact.event === secondArtifact.event;
    }

    function sameArtifactHasFailedBefore(artifact) {
      var found = false;
      self.failedAndChosenArtifactsSummary.forEach(function (artifactWrapperFromFailedAndChosen) {
        if (artifactWrapperFromFailedAndChosen.hasFailedServer === true && artifactsAreTheSameByIdVersionANDEvent(artifactWrapperFromFailedAndChosen.artifactData, artifact)) {
          found = true;
        }
      });
      return found;
    }
    function sameArtifactHasFailedBeforeWithDifferentEventOrVersion(currentArtifact) {
      var found = false;
      self.failedAndChosenArtifactsSummary.forEach(function (artifactWrapperFromFailedAndChosen) {
        if (artifactWrapperFromFailedAndChosen.hasFailedServer === true && currentArtifact.artifactId === artifactWrapperFromFailedAndChosen.artifactData.artifactId &&
          (currentArtifact.version !== artifactWrapperFromFailedAndChosen.artifactData.version || currentArtifact.event !== artifactWrapperFromFailedAndChosen.artifactData.event)) {
          found = true;
        }
      });
      return found;
    }
    function getArtifactsDataFromService() {
      initArtifacts().then(function () {
        var newAllVersionSummary = [];
        self.artifacts.forEach(function (currentArtifact) {
          var latestVersion = currentArtifact.version;
          self.basicTestInfoServerApi.getVersionSummary(latestVersion, currentArtifact.artifactId, currentArtifact.groupId, currentArtifact.event)
            .then(function (response) {
              var versionSummaryWrapper = {artifactData: response.data.responseBody, isChosen: false, hasFailedServer: false};
              newAllVersionSummary.push(versionSummaryWrapper);
              if (sameArtifactHasFailedBeforeWithDifferentEventOrVersion(currentArtifact)) {
                self.failedAndChosenArtifactsSummary = self.failedAndChosenArtifactsSummary.filter(function (artifactWrapperFromFailedAndChosen) {
                  return !(artifactWrapperFromFailedAndChosen.hasFailedServer && artifactsAreTheSameById(artifactWrapperFromFailedAndChosen.artifactData, currentArtifact));
                });
              }
              if (currentArtifact.analysisResultEnum === 'TEST_FAILED') {
                if (!sameArtifactHasFailedBefore(currentArtifact)) {
                  self.failedAndChosenArtifactsSummary.push(versionSummaryWrapper);
                  versionSummaryWrapper.hasFailedServer = true;
                }
              } else {
                // The artifact hasn't failed now
                if (sameArtifactHasFailedBefore(currentArtifact)) {
                  self.failedAndChosenArtifactsSummary = self.failedAndChosenArtifactsSummary.filter(function (artifactWrapperFromFailedAndChosen) {
                    return !(artifactWrapperFromFailedAndChosen.hasFailedServer && artifactsAreTheSameByIdVersionANDEvent(artifactWrapperFromFailedAndChosen.artifactData, currentArtifact));
                  });
                }
              }

              self.allVersionSummary = newAllVersionSummary;
            });
        });
      });
    }
    getArtifactsDataFromService();
    this.REFRESH_TIME = 5 * 60 * 1000; // five minutes
//    this.REFRESH_TIME = 1000;
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
