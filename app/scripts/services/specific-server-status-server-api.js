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
    this.getRunsDataOfSelectedTest = function (testName) {
      var testServerDataArr = [];
      for (var runIdx = 0; runIdx < self.runs.length; runIdx++) {
        var run = self.runs[runIdx];
        for (var testIdx = 0; testIdx < run.tests.length; testIdx++) {
          var currTest = run.tests[testIdx];
          if (currTest.name === testName) {
            testServerDataArr[runIdx] = getTestedServerDataForTest(currTest);
            testServerDataArr[runIdx]['runEndTime'] = run.endTime;
            break;
          }
        }
      }

      self.columnDefsForRunsOfSelectedTest = getColumnDefsForRunsOfSelectedTestArr(testServerDataArr);
      return testServerDataArr;
    };

    this.testNamesTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.testNames',
      columnDefs: [
        { field: 'testName', width: '150px', displayName: 'Test Name'}
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.runsOfSelectedTest = self.getRunsDataOfSelectedTest(selectedRow.entity.testName);

        self.chosenTestName = selectedRow.entity.testName;
        self.testIsSelected = true;
        return true;
      },
      init: resizeGridOnEventData
    };
    this.runsOfChosenTestTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.runsOfSelectedTest',
      columnDefs: self.columnDefsForRunsOfSelectedTest,
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
        self.serversDataOfTestOfSelectedRun = getServersDataOfTest(selectedRow.entity);
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
    function getServersDataOfTest(test) {
      var serversDataObjectsForTestArr = (JSON.parse(test.resultsForDisplay)).referenceServers;
      var testedServerDataOfTest = getTestedServerDataForTest(test);
      serversDataObjectsForTestArr.unshift(testedServerDataOfTest);
      return serversDataObjectsForTestArr;
    }
    function getTestedServerDataForTest(test) {
      return (JSON.parse(test.resultsForDisplay)).testedServer;
    }

    function getColumnDefsForRunsOfSelectedTestArr(runsOfSelectedTestArr) {
      var defs = [];
      var exampleRow = runsOfSelectedTestArr[0];
      // TODO move this to setAttrValuesCols
      var colNum = 0;
      for(var key in exampleRow) {
        var columnObj = {};
        if (key === 'runEndTime') {
          columnObj.cellFilter = 'date:\'MMM d, y -  H:mm:ss\'';
        }
        if (key === 'serverHostName') {
          // TODO upgrade ng-grid to 2.4 / higher - this shouldn't hold the server host name
          continue;
        }
        columnObj.field = key;
        // cellFilter: 'date:\'MMM d, y -  H:mm:ss\''
        columnObj.displayName = key.replace(/([A-Z])/g, ' $1');;
        defs[colNum] = columnObj;
        colNum++;
      }
      return defs;
    }
  }

  angular
    .module('postplayTryAppInternal')
    .service('specificServerStatusServerApi', SpecificServerStatusServerApi);

})();
