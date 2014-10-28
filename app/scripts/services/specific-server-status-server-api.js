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
      self.runsOfSelectedTestTestedServerData = [];
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
    this.getRunsDataOfSelectedTest = function (testName, jsonOfTestDataGetterFunction) {
      var testServerDataArr = [];
      var testToInsertIdx = 0;
      for (var runIdx = 0; runIdx < self.runs.length; runIdx++) {
        var run = self.runs[runIdx];
        for (var testIdx = 0; testIdx < run.tests.length; testIdx++) {
          var currTest = run.tests[testIdx];
          if (currTest.name === testName) {
            testServerDataArr[testToInsertIdx] = jsonOfTestDataGetterFunction(currTest);
            testServerDataArr[testToInsertIdx].runEndTime = run.endTime;
            testToInsertIdx++;
            break;
          }
        }
      }

      return testServerDataArr;
    };

    this.testNamesTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.testNames',
      columnDefs: [
        { field: 'testName', width: '150px', displayName: 'Test Name'}
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.runsOfSelectedTestTestedServerData = self.getRunsDataOfSelectedTest(selectedRow.entity.testName, self.getTestedServerDataForTest);
        self.runsOfSelectedTestAllServersData = self.getRunsDataOfSelectedTest(selectedRow.entity.testName, self.getAllServersDataForTest);
        self.chosenTestName = selectedRow.entity.testName;
        self.testIsSelected = true;
        return true;
      },
      init: resizeGridOnEventData
    };
    this.runsOfChosenTestTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.runsOfSelectedTestTestedServerData',
      columnDefs: 'serverStatusCtrl.specificServerStatusServerApi.getColumnDefsForRunsOfSelectedTestArr(serverStatusCtrl.specificServerStatusServerApi.runsOfSelectedTestTestedServerData, true)',
      multiSelect: false,
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
        self.serversDataOfTestOfSelectedRun = self.getAllServersDataForTest(selectedRow.entity);
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
      columnDefs: 'serverStatusCtrl.specificServerStatusServerApi.getColumnDefsForRunsOfSelectedTestArr(serverStatusCtrl.specificServerStatusServerApi.serversDataOfTestOfSelectedRun)',
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
    this.getAllServersDataForTest = function (test) {
      var serversDataObjectsForTestArr = (JSON.parse(test.resultsForDisplay)).referenceServers;
      var testedServerDataOfTest = self.getTestedServerDataForTest(test);
      serversDataObjectsForTestArr.unshift(testedServerDataOfTest);
      return serversDataObjectsForTestArr;
    };
    this.getTestedServerDataForTest = function (test) {
      return (JSON.parse(test.resultsForDisplay)).testedServer;
    };

    this.getColumnDefsForRunsOfSelectedTestArr = function (runsOfSelectedTestArr, withoutServerHostName) {
      var defs = [];
      var exampleRow = runsOfSelectedTestArr[0];
      // TODO move this to setAttrValuesCols
      var colNum = 0;
      for (var key in exampleRow) {
        var columnObj = {};
        if (key === 'serverHostName' && withoutServerHostName) {
          continue;
        }
        columnObj.field = key;
        columnObj.displayName = fieldToDisplayName(key);
        if (key === 'runEndTime') {
          columnObj.cellTemplate = '<div class="grid-action-cell" ng-click="serverStatusCtrl.specificServerStatusServerApi.buildGraphByAttribute(col.colDef.field, col.colDef.displayName)">{{row.entity[col.field] | date:\'d/M/yy H:mm\'}}</div>';
        } else if (withoutServerHostName) {
          columnObj.cellTemplate = '<div class="grid-action-cell" ng-click="serverStatusCtrl.specificServerStatusServerApi.buildGraphByAttribute(col.colDef.field, col.colDef.displayName)">{{row.entity[col.field]}}</div>';
        }
        defs[colNum] = columnObj;
        colNum++;
      }
      return defs;
    };
    this.buildGraphByAttribute = function (attribute, attributeDisplayName) {
      self.chosenAttributeName = attributeDisplayName;
      self.chartDataObject = self.getChartObjDataForSelectedTest(attribute);
      self.chartObject = {
        type: 'LineChart',
        displayed: true,
        data: self.chartDataObject,
        options: {
          title: 'Compare Runs for CHOSEN_ATTR',
          fill: 20,
          displayExactValues: true,
          explorer: {actions: ['dragToZoom', 'rightClickToReset']},
          vAxis: {
            title: 'Attr Values'
          },
          hAxis: {
            title: 'Runs'
          }
        },
        formatters: {}
      };
      self.attributeIsSelected = true;
    };
    function fieldToDisplayName(key) {
      var displayName = key.replace(/([A-Z])/g, ' $1');
      return displayName[0].toUpperCase() + displayName.slice(1);
    }

    this.getChartObjDataForSelectedTest = function (attrName) {
      var runsDataArr = self.runsOfSelectedTestAllServersData;
      var cols = [{label: 'Run', type: 'string'}, {label: 'Tested Server', type: 'number'}];
      var numOfServersInRunInTest = runsDataArr[0].length;
      for (var idxInColsArr = 2; idxInColsArr <= numOfServersInRunInTest; idxInColsArr++) {
        cols[idxInColsArr] = {label: 'Reference Server', type: 'number'};
      }

      var rows = [];
      var numOfRunsRelatedToTest = runsDataArr.length;

      function insertAttributeDataToRowsArray(idxInRowsArr, serverIdx) {
        runsDataArr[idxInRowsArr].forEach(function (runServerDataObj) {
          rows[idxInRowsArr].c[serverIdx] = {v: runServerDataObj[attrName]};
          serverIdx++;
        });
      }
      for (var idxInRowsArr = 0; idxInRowsArr < numOfRunsRelatedToTest; idxInRowsArr++) {
        var runIdx = idxInRowsArr + 1;
        rows[idxInRowsArr] = {c: [
          {v: 'Run ' + runIdx}
        ]};
        var serverIdx = 1;
        insertAttributeDataToRowsArray(idxInRowsArr, serverIdx);
      }
      return {cols: cols, rows: rows};
    };

  }

  angular
    .module('postplayTryAppInternal')
    .service('specificServerStatusServerApi', SpecificServerStatusServerApi);

})();
