'use strict';

(function () {

  /* @ngInject */
  function SpecificServerStatusServerApi($http, serverApiUrl, $timeout) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    function init() {
      self.serverResponseBody = {};
      self.isDataLoaded = false;
      self.selectedRun = {};
      self.artifactName = '';
      self.artifactId = '';
      self.serverName = '';
      self.version = '';
      self.runIsSelected = false;
      self.testIsSelected = false;
      self.testOfRunIsSelected = false;
      self.runsOfSelectedTest = [];
      self.serversDataOfTestOfSelectedRun = [];
    }
    var self = this;
    init();

    function resizeGridOnEventData(gridCtrl, gridScope) {
      gridScope.$on('ngGridEventData', function () {
        $timeout(function () {
          angular.forEach(gridScope.columns, function (col) {
            gridCtrl.resizeOnData(col);
          });
        });
      });
    }
    // Public API here
    this.getServerData = function (server, artifactId, groupId) {
      var API_URL = serverApiUrl.SERVER_STATUS_API_URL_PREFIX + server + '&artifactId=' + artifactId + '&groupId=' + groupId;
      $http.get(API_URL)
        .then(function (response) {
          self.serverResponseBody = response.data.responseBody;
          self.completedTestsPercent = self.serverResponseBody.completedTestsPercent;
          self.completedNumberOfRuns = self.serverResponseBody.runs.completedNumberOfRuns;
          self.totalNumberOfRuns = self.serverResponseBody.runs.totalNumberOfRuns;
          self.analysisStatus = self.serverResponseBody.analysisStatus;
          self.artifactName = self.serverResponseBody.artifactName;
          self.artifactId = self.serverResponseBody.artifactId;
          self.serverName = self.serverResponseBody.server;
          self.version = self.serverResponseBody.version;
          self.isDataLoaded = true;
          self.runs = response.data.responseBody.runs.runs;
          self.testNames = getTestNames(self.runs);
        });
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
        { field: 'testName', width: '150px', displayName: 'Test Name'}
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.runsOfSelectedTest = self.getRunsOfSelectedTest(selectedRow.entity.testName);
        self.chosenRunOfTest = selectedRow.entity.testName;
        self.testIsSelected = true;
        return true;
      },
      init: resizeGridOnEventData
    };
    this.runsOfChosenTestTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.runsOfSelectedTest',
      columnDefs: [
        { field: 'runStatus', width: '20%', displayName: 'Run Status'},
        { field: 'numberOfTests', width: '20%', displayName: 'Number of Tests'},
        { field: 'plannedExecutionTimeUtc', width: '40%', displayName: 'Start Time', cellFilter: 'date:\'MMM d, y -  H:mm:ss\'' }
      ],
      enableRowSelection: false,
      init: resizeGridOnEventData
    };
    this.runsTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.runs',
      columnDefs: [
        { field: 'runStatus', displayName: 'Status', cellTemplate: 'views/runs-image-template.html', width: '20%'},
        { field: 'startTime', displayName: 'Start Time', width: '40%', cellFilter: 'date: \'MMM d, y  - H:mm:ss\'' },
        { field: 'endTime', displayName: 'End Time', width: '40%', cellFilter: 'date: \'MMM d, y -  H:mm:ss\'' }
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.selectedRun = selectedRow.entity;
        self.runIsSelected = true;
        self.testOfRunIsSelected = false;
        getTestsOfRunBasicTableData();
        return true;
      },
      init: resizeGridOnEventData
    };
    this.testsOfSelectedRunBasicTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.tests',
      columnDefs: [
        { field: 'name', width: '30%', displayName: 'Test Name'},
        { field: 'testStatus', displayName: 'Test Status', width: '30%' },
        { field: 'analysisResultStatus', displayName: 'Results Status', cellTemplate: 'views/test-of-run-image-template.html', width: '40%'}
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        getServersDataOfTestOfSelectedRun(selectedRow.entity);
        self.testOfRunIsSelected = true;
        self.chosenTestOfRun = selectedRow.entity.name;
//        self.chosenTestOfRun = '656374567';
        return true;
      },
      init: resizeGridOnEventData
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
      init: resizeGridOnEventData
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
  }

  angular
    .module('postplayTryAppInternal')
    .service('specificServerStatusServerApi', SpecificServerStatusServerApi);

})();
