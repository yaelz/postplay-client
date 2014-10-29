'use strict';

(function () {

  /* @ngInject */
  function SpecificServerStatusServerApi($http, serverApiUrl, $timeout) {
    var self = this;
    var cellFilterString = 'date:\'d/M/yy H:mm\'';

    function resizeGridOnEventData(gridCtrl, gridScope) {
      gridScope.$on('ngGridEventData', function () {
        $timeout(function () {
          angular.forEach(gridScope.columns, function (col) {
            gridCtrl.resizeOnData(col);
          });
        });
      });
    }
    this.getServerData = function (server, artifactId, groupId) {
      var API_URL = serverApiUrl.SERVER_STATUS_API_URL_PREFIX + server + '&artifactId=' + artifactId + '&groupId=' + groupId;
      $http.get(API_URL)
        .then(function (response) {
          self.serverResponseBody = response.data.responseBody;
          self.completedTestsPercent = self.serverResponseBody.completedTestsPercent;
          self.completedNumberOfRuns = self.serverResponseBody.runs.completedNumberOfRuns;
          self.analysisStatus = self.serverResponseBody.analysisStatus;
          self.artifactName = self.serverResponseBody.artifactName;
          self.artifactId = self.serverResponseBody.artifactId;
          self.serverName = self.serverResponseBody.server;
          self.version = self.serverResponseBody.version;
          self.runs = self.serverResponseBody.runs.runs;
          self.testNames = getTestNames();
          self.isDataLoaded = true;
        });
    };
    this.getServersDataOfSelectedTest = function (testName, jsonOfTestDataGetterFunction) {
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
        { field: 'testName', displayName: 'Test Name'}
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.attributeIsSelected = false;
        self.runsOfSelectedTestTestedServerData = self.getServersDataOfSelectedTest(selectedRow.entity.testName, self.getTestedServerDataForTest);
        self.runsOfSelectedTestAllServersData = self.getServersDataOfSelectedTest(selectedRow.entity.testName, self.getAllServersDataForTest);
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
      init: resizeGridOnEventData,
      beforeSelectionChange: function () {
        return false;
      }
    };
    this.runsTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.runs',
      columnDefs: [
        { field: 'runStatus', displayName: 'Status', cellTemplate: 'views/runs-image-template.html', width: '20%'},
        { field: 'startTime', displayName: 'Start Time', width: '40%', cellFilter: cellFilterString },
        { field: 'endTime', displayName: 'End Time', width: '40%', cellFilter: cellFilterString }
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        self.testOfRunIsSelected = false;
        self.selectedRun = selectedRow.entity;
        self.testsOfSelectedRunData = self.selectedRun.tests;
        self.runIsSelected = true;
        return true;
      },
      init: resizeGridOnEventData
    };
    this.testsOfSelectedRunBasicTableData = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.testsOfSelectedRunData',
      columnDefs: [
        { field: 'name', displayName: 'Test Name', width: '30%'},
        { field: 'testStatus', displayName: 'Test Status', width: '30%' },
        { field: 'analysisResultStatus', displayName: 'Results Status', width: '40%', cellTemplate: 'views/test-of-run-image-template.html'}
      ],
      multiSelect: false,
      beforeSelectionChange: function (selectedRow) {
        var selectedTestData = selectedRow.entity;
        self.serversDataOfTestOfSelectedRun = self.getAllServersDataForTest(selectedTestData);
        self.chosenTestOfRun = selectedTestData.name;
        self.testOfRunIsSelected = true;
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

    function getTestNames() {
      var testNamesArray = [];

      function insertTestNameIfNotAlreadyInArray(testName) {
        function testNameExistsInTestNamesArray() {
          var testNameExists = false;
          for (var testNamesIdx = 0; testNamesIdx < testNamesArray.length; testNamesIdx++) {
            if (testName === testNamesArray[testNamesIdx].testName) {
              testNameExists = true;
            }
          }
          return testNameExists;
        }

        if (!testNameExistsInTestNamesArray(testName)) {
          testNamesArray[testNamesArray.length] = {testName: testName};
        }
      }

      for (var runsIdx = 0; runsIdx < self.runs.length; runsIdx++) {
        var run = self.runs[runsIdx];
        for (var testIdx = 0; testIdx < run.tests.length; testIdx++) {
          var testName = run.tests[testIdx].name;
          insertTestNameIfNotAlreadyInArray(testName);
        }
      }
      return testNamesArray;
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
      var colNum = 0;
      for (var key in exampleRow) {
        var columnObj = {};
        if (key === 'serverHostName' && withoutServerHostName) {
          continue;
        }
        columnObj.field = key;
        columnObj.displayName = fieldToDisplayName(key);
        if (key === 'runEndTime') {
          columnObj.cellTemplate = '<div class="ngCellText">{{row.entity[col.field] | date:\'d/M/yy H:mm\'}}</div>';
        } else if (withoutServerHostName) {
          columnObj.cellTemplate = '<div class="ngCellText" ng-click="serverStatusCtrl.specificServerStatusServerApi.buildChartByAttribute(col.colDef.field, col.colDef.displayName)">{{row.entity[col.field]}}</div>';
        }
        defs[colNum] = columnObj;
        colNum++;
      }
      return defs;
    };
    this.buildChartByAttribute = function (attribute, attributeDisplayName) {
      self.chosenAttributeName = attributeDisplayName;
      self.chartDataObject = self.getChartObjDataForSelectedTest(attribute);
      self.chartObject = {
        type: 'LineChart',
        displayed: true,
        data: self.chartDataObject,
        options: {
          fill: 20,
          displayExactValues: true,
          explorer: {actions: ['dragToZoom', 'rightClickToReset']},
          vAxis: {
            title: 'Attribute Values'
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

      function insertAttributeDataToRowsArray(idxInRowsArr) {
        var serverIdx = 1;
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

        insertAttributeDataToRowsArray(idxInRowsArr);
      }
      return {cols: cols, rows: rows};
    };

  }

  angular
    .module('postplayTryAppInternal')
    .service('specificServerStatusServerApi', SpecificServerStatusServerApi);

})();
