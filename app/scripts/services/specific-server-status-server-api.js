'use strict';

(function () {

  /* @ngInject */
  function SpecificServerStatusServerApi($http, serverApiUrl) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.serverResponseBody = {};
    this.isDataLoaded = false;
    this.selectedRun = {};
    this.selectedTestName = '';
    this.runIsSelected = false;
    this.testOfRunHasBeenSelected = false;
    this.runsOfChosenTestToDisplay = [];
    this.testsOfRunResultsToDisplayData = []
    this.testIsSelected = false;
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
    this.getRunsOfSelectedTest = function (testName) {
      var runArr = [];
      for (var i = 0; i < self.runs.length; i++) {
        var run = self.runs[i];
        for (var j = 0; j < run.tests.length; j++) {
          if (self.runs[i].tests[j].name === testName) {
            runArr[runArr.length] = self.runs[i];
          }
        }
      }
      return runArr;
    };
    this.testNamesTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.testNames',
      columnDefs: [
        { field: 'testName', width: 120, displayName: 'Test Name'}
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.selectedTestName = selectedRow.entity.testName;
        self.testIsSelected = true;
        self.runsOfChosenTestToDisplay = self.getRunsOfSelectedTest(self.selectedTestName);
        self.testIsSelected = true;
        return true;
//        self.run
      }
    };
    this.runsOfChosenTestTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.runsOfChosenTestToDisplay',
      columnDefs: [
        { field: 'runStatus', width: '30%', displayName: 'Run Status'},
        { field: 'numberOfTests', width: '30%', displayName: 'Num of Tests'},
        { field: 'plannedExecutionTimeUtc', width: '30%', displayName: 'Start Time', cellFilter: 'date:\'HH:mm:ss\'' }
      ],
      enableRowSelection: false
    };
    this.runsTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.runs',
      columnDefs: [
        { field: 'runStatus', width: '30%', displayName: 'Run Status', resizable: true},
        { field: 'startTime', displayName: 'Start Time', width: '30%', cellFilter: 'date:\'HH:mm:ss\'' },
        { field: 'endTime', displayName: 'End Time', width: '30%', cellFilter: 'date:\'HH:mm:ss\'' }
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.selectedRun = selectedRow.entity;
        self.runIsSelected = true;
        self.testOfRunHasBeenSelected = false;
        getTestsOfRunBasicTableData();
        return true;
      }
    };

    this.testsBasicTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.tests',
      columnDefs: [
        { field: 'name', width: '30%', displayName: 'Test Name'},
        { field: 'testStatus', displayName: 'Test Status', width: '50%' },
        { field: 'analysisResultStatus', displayName: 'Results Status', width: '20%'}
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.selectedTestFromRun = selectedRow.entity;
        getTestsOfRunResultsToDisplayData();
        self.testOfRunHasBeenSelected = true;
        return true;
      }
    };

    this.testsOfSelectedRunTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.testsOfRunResultsToDisplayData',
      rowTemplate: '' +
        '<div style="height: 100%" ng-class="{ppSsTestedServer: row.rowIndex == 0}">' +
            '<div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            '<div ng-cell>' +
            '</div>' +
            '</div>' +
        '</div>',
      columnDefs: [
        { field: 'systemError', width: '25%', displayName: 'System Error'},
        { field: 'serverHostName', displayName: 'Server Host Name', width: '35%' },
        { field: 'systemFatal', displayName: 'system Fatal', width: '20%' },
        { field: 'errorRate', displayName: 'Error Rate', width: '20%'}
      ],
      enableRowSelection: false
    };

    function getTestNames(runs) {
      var testNames = [];
      for (var runsIdx = 0; runsIdx < runs.length; ++runsIdx) {
        var run = runs[runsIdx];
        for (var testIdx = 0; testIdx < run.tests.length; ++testIdx) {
          var test = run.tests[testIdx];
          var isFound = false;
          for (var testNamesIdx = 0; testNamesIdx < testNames.length; ++testNamesIdx) {
            if (test.name === testNames[testNamesIdx].testName)  {
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
    function getTestsOfRunBasicTableData() {
      self.tests = self.selectedRun.tests;
    }
    function getTestsOfRunResultsToDisplayData() {
      self.testsOfRunResultsToDisplayData = (JSON.parse(self.selectedTestFromRun.resultsForDisplay)).referenceServers;
      self.testsOfRunResultsToDisplayData.unshift((JSON.parse(self.selectedTestFromRun.resultsForDisplay)).testedServer);
//      referenceServers
    }
  }

  angular
    .module('postplayTryAppInternal')
    .service('specificServerStatusServerApi', SpecificServerStatusServerApi);

})();
