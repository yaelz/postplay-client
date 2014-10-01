'use strict';

(function () {

  /* @ngInject */
  function SpecificServerStatusServerApi($http, serverApiUrl) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.serverResponseBody = {};
    this.isDataLoaded = false;
    this.selectedRun = {};
    this.runHasBeenSelected = false;
    var self = this;

    // Public API here
    this.getServerData = function (server, artifactId, groupId) {
      var API_URL = serverApiUrl.SERVER_STATUS_API_URL_PREFIX + server + '&artifactId=' + artifactId + '&groupId=' + groupId;
      $http.get(API_URL)
        .then(function (response) {
          angular.copy(response.data.responseBody, self.serverResponseBody);
          self.isDataLoaded = true;
          self.runs = response.data.responseBody.runs.runs;
          self.testNames = getTestNames(self.runs);
        });
    };
    this.getArtifactId = function () {
      return self.serverResponseBody.artifactId;
    };
    this.getArtifactName = function () {
      return self.serverResponseBody.artifactName;
    };
    this.getVersion = function () {
      return self.serverResponseBody.version;
    };
    this.getServerName = function () {
      return self.serverResponseBody.server;
    };
    this.getTotalNumberOfRuns = function () {
      return self.serverResponseBody.runs.totalNumberOfRuns;
    };
    this.getNumberOfCompletedRuns = function () {
      return self.serverResponseBody.runs.completedNumberOfRuns;
    };
    this.getCompletedTestsPercent = function () {
      return self.serverResponseBody.completedTestsPercent;
    };
    this.getCompletedTestsStatus = function () {
      return self.serverResponseBody.analysisStatus;
    };
    this.testNamesTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.testNames',
      columnDefs: [
        { field: 'testName', width: 120, displayName: 'Test Name'}
      ],
      multiSelect: false
    };
    this.runsTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.runs',
      columnDefs: [
        { field: 'runStatus', width: 120, displayName: 'Run Status', resizable: true},
        { field: 'startTime', displayName: 'Start Time', width: 140 },
        { field: 'endTime', displayName: 'End Time', width: 140 }
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.selectedRun = selectedRow.entity;
        self.runHasBeenSelected = true;
        getTestsBasicTableData();
        return true;
      }
    };
    this.testsBasicTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.testsBasicTableData',
      columnDefs: [
        { field: 'name', width: 220, displayName: 'Test Name', resizable: true},
        { field: 'testStatus', displayName: 'Test Status', width: 400 },
        { field: 'analysisResultStatus', displayName: 'Results Status', width: 400}
      ]
    };

    function getTestNames(runs) {
      var testNames = [];
      for (var runsIdx = 0; runsIdx < runs.length; ++runsIdx) {
        var run = runs[runsIdx];
        for (var testIdx = 0; testIdx < run.tests.length; ++testIdx) {
          var test = run.tests[testIdx];
          var isFound = false;
          for (var testNamesIdx = 0; testNamesIdx < testNames.length; ++testNamesIdx) {
            if (test.name === testNames[testNamesIdx])  {
              isFound = true;
            }
          }
          if (!isFound) {
            testNames[testNames.length] = {testName: test.name};
          }
        }
      }
      return testNames;
    }
    function getTestsBasicTableData() {
      self.testsBasicTableData = self.selectedRun.tests;
    }
  }

  angular
    .module('postplayTryAppInternal')
    .service('specificServerStatusServerApi', SpecificServerStatusServerApi);

})();
