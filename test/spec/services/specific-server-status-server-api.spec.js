'use strict';

describe('Service: specificServerStatusServerApi', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var specificServerStatusServerApi, $httpBackend, specificServerServerResponse, $rootScope, API_URL, responseBody;
  beforeEach(inject(function (_specificServerStatusServerApi_, _serverApiUrl_, _specificServerServerResponse_, _$httpBackend_, _$rootScope_) {
    specificServerStatusServerApi = _specificServerStatusServerApi_;
    specificServerServerResponse = _specificServerServerResponse_;
    API_URL = _serverApiUrl_.PREFIX + _serverApiUrl_.SERVER_STATUS_API_URL_PREFIX + specificServerServerResponse.serverData.server + '&artifactId=' + specificServerServerResponse.serverData.artifactId + '&groupId=' + specificServerServerResponse.serverData.groupId;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  function callGetServerStatusMethodAndFlushHttpBackend() {
    $httpBackend.expectGET(API_URL).respond(200, specificServerServerResponse.serverData);
    responseBody = specificServerServerResponse.serverData;
    specificServerStatusServerApi.getServerData(responseBody.server, responseBody.artifactId, responseBody.groupId);
    $httpBackend.flush();
  }

  it('should get the server\'s status', function () {
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.serverResponseBody).toEqual(responseBody);
  });
  it('should hold a variable which tells whether the server data is loaded', function () {
    expect(specificServerStatusServerApi.isDataLoaded).not.toBeTruthy();
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.isDataLoaded).toBe(true);
  });

  describe('After getting the server data', function () {
    beforeEach(function () {
      callGetServerStatusMethodAndFlushHttpBackend();
    });
    function chooseCertainRowInCertainTable(tableData, selectedRow) {
      tableData.beforeSelectionChange(selectedRow);
    }
    it('should hold the runs data', function () {
      expect(specificServerStatusServerApi.runs).toEqual(responseBody.runs.runs);
    });

    it('should hold the tests data for a specific run', function () {
      expect(specificServerStatusServerApi.runIsSelected).not.toBeTruthy();
      //TODO should this be done here or in the e2e? It's testing this service but also the click...
      var selectedRunRow = {entity: specificServerServerResponse.serverData.runs.runs[0]};
      chooseCertainRowInCertainTable(specificServerStatusServerApi.runsTableData, selectedRunRow);
      expect(specificServerStatusServerApi.runIsSelected).toBe(true);
      expect(specificServerStatusServerApi.testsOfSelectedRunData).toEqual(selectedRunRow.entity.tests);
      expect(specificServerStatusServerApi.testOfRunIsSelected).not.toBeTruthy();
    });
    it('should hold server data for a specific test in a specific run', function () {
      expect(specificServerStatusServerApi.testOfRunIsSelected).not.toBeTruthy();
      var selectedTestRow = {entity: responseBody.runs.runs[0].tests[0]};
      //TODO should this be done here or in the e2e? It's testing this service but also the click...
      chooseCertainRowInCertainTable(specificServerStatusServerApi.testsOfSelectedRunBasicTableData, selectedTestRow);
      expect(specificServerStatusServerApi.testOfRunIsSelected).toBe(true);
      function createServersDataOfTestOfSelectedRun(selectedTestRow) {
        var resultsToDisplayJson = JSON.parse(selectedTestRow.entity.resultsForDisplay);
        var serversData = resultsToDisplayJson.referenceServers;
        serversData.unshift(resultsToDisplayJson.testedServer);
        return serversData;
      }
      var serversDataOfTestOfSelectedRun = createServersDataOfTestOfSelectedRun(selectedTestRow);
      expect(specificServerStatusServerApi.serversDataOfTestOfSelectedRun).toEqual(serversDataOfTestOfSelectedRun);
    });
    it('should hold all test names, each test name once', function () {
      expect(specificServerStatusServerApi.testNames).toEqual([{testName: 'AppInfo Sanity'}, {testName: 'AppInfo Sanity2'}, {testName: 'Another test'}, {testName: 'Yet Another test'}]);
    });
    it('should hold the server status basic data', function () {
      expect(specificServerStatusServerApi.artifactId).toEqual(specificServerServerResponse.serverData.artifactId);
      expect(specificServerStatusServerApi.artifactName).toEqual(specificServerServerResponse.serverData.artifactName);
      expect(specificServerStatusServerApi.version).toEqual(specificServerServerResponse.serverData.version);
      expect(specificServerStatusServerApi.serverName).toEqual(specificServerServerResponse.serverData.server);
      expect(specificServerStatusServerApi.completedNumberOfRuns).toEqual(specificServerServerResponse.serverData.runs.completedNumberOfRuns);
      expect(specificServerStatusServerApi.completedTestsPercent).toEqual(specificServerServerResponse.serverData.completedTestsPercent);
      expect(specificServerStatusServerApi.analysisStatus).toEqual(specificServerServerResponse.serverData.analysisStatus);
    });
    it('should be able to get all runs\' data of the tested server for a specific test', function () {
      var runsDataOfSelectedTest = [
        {runEndTime: 1410959637697,
          systemError: 3.789,
          serverHostName: 'app30.aus.wixpress.com',
          systemFatal: 0.0,
          errorRate: 0.0
        },
        {runEndTime: 1410959697696,
          systemError: 6,
          serverHostName: 'app30.aus.wixpress.com',
          systemFatal: 0.0,
          errorRate: 0.1
        }
      ];
      expect(specificServerStatusServerApi.getServersDataOfSelectedTest('AppInfo Sanity2', specificServerStatusServerApi.getTestedServerDataForTest)).toEqual(runsDataOfSelectedTest);
    });
//    it('should be able to get all runs\' data of all servers for a specific test', function () {
//    TODO
//      var runsDataOfSelectedTest = [
//        [{systemError: 3.789,
//          serverHostName: 'app30.aus.wixpress.com',
//          systemFatal: 0.0,
//          errorRate: 0.0
//        },
//          {systemError: 4,
//            serverHostName: 'app33.aus.wixpress.com',
//            systemFatal: 0.0,
//            errorRate: 0.0
//          },
//          {systemError: 5,
//            serverHostName: 'apu1.aus.wixpress.com',
//            systemFatal: 0.0,
//            errorRate: 0.0
//          }],
//        [{systemError: 6,
//          serverHostName: 'app30.aus.wixpress.com',
//          systemFatal: 0.0,
//          errorRate: 0.1
//        },
//          {systemError: 7,
//            serverHostName: 'app33.aus.wixpress.com',
//            systemFatal: 0.0,
//            errorRate: 0.0
//          },
//          {systemError: 8,
//            serverHostName: 'apu1.aus.wixpress.com',
//            systemFatal: 0.0,
//            errorRate: 0.0
//          }]
//      ];
//      expect(specificServerStatusServerApi.getServersDataOfSelectedTest('AppInfo Sanity2', specificServerStatusServerApi.getAllServersDataForTest)).toEqual(runsDataOfSelectedTest);
//    });
    it('should be able to get column defs for runs of selected test', function () {
      var cellTemplateWithClick = '<div class=\"ngCellText\" ng-click=\"serverStatusCtrl.specificServerStatusServerApi.buildChartByAttribute(col.colDef.field, col.colDef.displayName)\">{{row.entity[col.field]}}</div>';
      var cellTemplateWithDateFilter = '<div class=\"ngCellText\">{{row.entity[col.field] | date:\'d/M/yy H:mm\'}}</div>';
      var columnDefs = [
        {
          field: 'runEndTime',
          displayName: 'Run End Time',
          cellTemplate: cellTemplateWithDateFilter
        },
        {
          field: 'errorRate',
          displayName: 'Error Rate',
          cellTemplate: cellTemplateWithClick
        },
        {
          field: 'systemError',
          displayName: 'System Error',
          cellTemplate: cellTemplateWithClick
        },
        {
          field: 'systemFatal',
          displayName: 'System Fatal',
          cellTemplate: cellTemplateWithClick
        }
      ];
      var exampleRow = {
        runEndTime: 1410959637697,
        errorRate: 0,
        serverHostName: 'app30.aus.wixpress.com',
        systemError: 0,
        systemFatal: 0
      };
      var runsOfSelectedTestArr = [exampleRow];
      expect(specificServerStatusServerApi.getColumnDefsForRunsOfSelectedTestArr(runsOfSelectedTestArr, true)).toEqual(columnDefs);
    });
    it('should be able to get data for the chart object, for a specific attribute', function () {
      // TODO how do I choose a run? Is this suppose to be in the E2E after clicking a test name?
      specificServerStatusServerApi.runsOfSelectedTestAllServersData = [
        [
          {errorRate: 0,
            serverHostName: 'app30.aus.wixpress.com',
            systemError: 3.789,
            systemFatal: 0
          },
          {errorRate: 0,
            serverHostName: 'app33.aus.wixpress.com',
            systemError: 4,
            systemFatal: 0
          },
          {errorRate: 0,
            serverHostName: 'apu1.aus.wixpress.com',
            systemError: 5,
            systemFatal: 0
          }
        ],
        [
          {errorRate: 0,
            serverHostName: 'app30.aus.wixpress.com',
            systemError: 6,
            systemFatal: 0
          },
          {errorRate: 0,
            serverHostName: 'app33.aus.wixpress.com',
            systemError: 7,
            systemFatal: 0
          },
          {errorRate: 0,
            serverHostName: 'apu1.aus.wixpress.com',
            systemError: 8,
            systemFatal: 0
          }
        ]
      ];
      var chartObjDataForTest = {
        cols: [
          {
            label: 'Run',
            type: 'string'
          },
          {
            label: 'Tested Server',
            type: 'number'
          },
          {
            label: 'Reference Server',
            type: 'number'
          },
          {
            label: 'Reference Server',
            type: 'number'
          }
        ],
        rows: [
          {
            c: [
              {
                v: 'Run 1'
              },
              {
                v: 3.789
              },
              {
                v: 4
              },
              {
                v: 5
              }
            ]
          },
          {
            c: [
              {
                v: 'Run 2'
              },
              {
                v: 6
              },
              {
                v: 7
              },
              {
                v: 8
              }
            ]
          }
        ]
      };
      var attrName = 'systemError';
      expect(specificServerStatusServerApi.getChartObjDataForSelectedTest(attrName)).toEqual(chartObjDataForTest);
    });
  });
});
