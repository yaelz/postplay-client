'use strict';

(function () {

  /* @ngInject */
  function SpecificServerStatusServerApi($http, serverApiUrl, $timeout) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.serverResponseBody = {};
    this.isDataLoaded = false;
    this.selectedRun = {};
    this.runIsSelected = false;
    this.testIsSelected = false;
    this.testOfRunIsSelected = false;
    this.runsOfSelectedTest = [];
    this.serversDataOfTestOfSelectedRun = [];
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
        { field: 'testName', width: 100, displayName: 'Test Name'}
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.runsOfSelectedTest = self.getRunsOfSelectedTest(selectedRow.entity.testName);
        self.testIsSelected = true;
        return true;
      },
      init: init
    };
    this.runsOfChosenTestTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.runsOfSelectedTest',
      columnDefs: [
        { field: 'runStatus', width: '20%', displayName: 'Run Status'},
        { field: 'numberOfTests', width: '40%', displayName: 'Num of Tests'},
        { field: 'plannedExecutionTimeUtc', width: '40%', displayName: 'Start Time', cellFilter: 'date:\'MMM d, y -  h:mm a\'' }
      ],
      enableRowSelection: false,
      init: init
    };
    this.runsTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.runs',
      columnDefs: [
        { field: 'runStatus', width: '30%', displayName: 'Run Status', resizable: true},
        { field: 'startTime', displayName: 'Start Time', width: '30%', cellFilter: 'date: \'MMM d, y  - h:mm:ss a\'' },
        { field: 'endTime', displayName: 'End Time', width: '30%', cellFilter: 'date: \'MMM d, y -  h:mm:ss a\'' }
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.selectedRun = selectedRow.entity;
        self.runIsSelected = true;
        self.testOfRunIsSelected = false;
        getTestsOfRunBasicTableData();
        return true;
      },
      init: init
    };
    this.testsOfSelectedRunBasicTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.tests',
      columnDefs: [
        { field: 'name', width: '30%', displayName: 'Test Name'},
        { field: 'testStatus', displayName: 'Test Status', width: '50%' },
        { field: 'analysisResultStatus', displayName: 'Results Status', width: '20%'}
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        getServersDataOfTestOfSelectedRun(selectedRow.entity);
        self.testOfRunIsSelected = true;
        return true;
      },
      init: init
    };
    this.serversOfSelectedTestOfSelectedRunTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.serversDataOfTestOfSelectedRun',
      rowTemplate: '' +
        '<div style="height: 100%" ng-class="{ppSsTestedServer: row.rowIndex == 0}">' +
            '<div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            '<div ng-cell>' +
            '</div>' +
            '</div>' +
        '</div>',
      columnDefs: [
        { field: 'serverHostName', displayName: 'Server Host Name', width: '35%' },
        { field: 'systemError', width: '25%', displayName: 'System Error'},
        { field: 'systemFatal', displayName: 'system Fatal', width: '20%' },
        { field: 'errorRate', displayName: 'Error Rate', width: '20%'}
      ],
      enableRowSelection: false,
      init: init
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
    function getServersDataOfTestOfSelectedRun(selectedTestFromRun) {
      self.serversDataOfTestOfSelectedRun = (JSON.parse(selectedTestFromRun.resultsForDisplay)).referenceServers;
      self.serversDataOfTestOfSelectedRun.unshift((JSON.parse(selectedTestFromRun.resultsForDisplay)).testedServer);
    }
    function init(gridCtrl, gridScope) {
      gridScope.$on('ngGridEventData', function () {
        $timeout(function () {
          angular.forEach(gridScope.columns, function (col) {
            gridCtrl.resizeOnData(col);
          });
        });
      });
    }
  }

  angular
    .module('postplayTryAppInternal')
    .service('specificServerStatusServerApi', SpecificServerStatusServerApi);

})();
