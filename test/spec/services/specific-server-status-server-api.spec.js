'use strict';

describe('Service: specificServerStatusServerApi', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var specificServerStatusServerApi, $httpBackend, serverApiUrl, specificServerServerResponse, specificServerData, $rootScope;
  beforeEach(inject(function (_specificServerStatusServerApi_, _$httpBackend_, _serverApiUrl_, _specificServerServerResponse_, _specificServerData_, _$rootScope_) {
    specificServerStatusServerApi = _specificServerStatusServerApi_;
    $httpBackend = _$httpBackend_;
    serverApiUrl = _serverApiUrl_;
    specificServerServerResponse = _specificServerServerResponse_;
    specificServerData = _specificServerData_;
    $rootScope = _$rootScope_;
  }));

  function callGetServerStatusMethodAndFlushHttpBackend() {
    var API_URL = serverApiUrl.SERVER_STATUS_API_URL_PREFIX + specificServerServerResponse.serverData.responseBody.server + '&artifactId=' + specificServerServerResponse.serverData.responseBody.artifactId + '&groupId=' + specificServerServerResponse.serverData.responseBody.groupId;
    $httpBackend.expectGET(API_URL).respond(200, specificServerServerResponse.serverData);
    specificServerStatusServerApi.getServerData(specificServerServerResponse.serverData.responseBody.server, specificServerServerResponse.serverData.responseBody.artifactId, specificServerServerResponse.serverData.responseBody.groupId);
    $httpBackend.flush();
  }

  it('should get the server\'s status', function () {
    expect(specificServerStatusServerApi.serverResponseBody).toEqual({});
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.serverResponseBody).toEqual(specificServerServerResponse.serverData.responseBody);
  });
  it('should know whether the data is loaded or not', function () {
    expect(specificServerStatusServerApi.isDataLoaded).toBe(false);
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.isDataLoaded).toBe(true);
  });

  describe('After getting the server status', function () {
    beforeEach(function () {
      callGetServerStatusMethodAndFlushHttpBackend();
    });
    it('should hold the runs', function () {
      expect(specificServerStatusServerApi.runs).toEqual(specificServerServerResponse.serverData.responseBody.runs.runs);
    });
    it('should hold the tests data for a specific run', function () {
      expect(specificServerStatusServerApi.runIsSelected).toBe(false);
      var selectedRow = {entity: specificServerServerResponse.serverData.responseBody.runs.runs[0]};
      specificServerStatusServerApi.runsTableData.beforeSelectionChange(selectedRow);
      expect(specificServerStatusServerApi.tests).toEqual(selectedRow.entity.tests);
      expect(specificServerStatusServerApi.runIsSelected).toBe(true);
      expect(specificServerStatusServerApi.testOfRunIsSelected).toBe(false);
    });
    it('should hold server data for a specific test in a specific run', function () {
      var selectedTestForSelectedRun = {entity: specificServerServerResponse.serverData.responseBody.runs.runs[0].tests[0]};
      specificServerStatusServerApi.testsOfSelectedRunBasicTableData.beforeSelectionChange(selectedTestForSelectedRun);
      var resultsToDisplayJson = JSON.parse(selectedTestForSelectedRun.entity.resultsForDisplay);
      var arr = resultsToDisplayJson.referenceServers;
      arr.unshift(resultsToDisplayJson.testedServer);
      expect(specificServerStatusServerApi.serversDataOfTestOfSelectedRun).toEqual(arr);
    });
    it('should hold all test names, each test name once!', function () {
      expect(specificServerStatusServerApi.testNames).toEqual([{testName: 'AppInfo Sanity'}, {testName: 'AppInfo Sanity2'}, {testName: 'Another test'}, {testName: 'Yet Another test'}]);
    });
    it('should hold the artifactId', function () {
      expect(specificServerStatusServerApi.artifactId).toEqual(specificServerServerResponse.serverData.responseBody.artifactId);
    });
    it('should hold the artifactName', function () {
      expect(specificServerStatusServerApi.artifactName).toEqual(specificServerServerResponse.serverData.responseBody.artifactName);
    });
    it('should hold the version', function () {
      expect(specificServerStatusServerApi.version).toEqual(specificServerServerResponse.serverData.responseBody.version);
    });
    it('should hold the server name', function () {
      expect(specificServerStatusServerApi.serverName).toEqual(specificServerServerResponse.serverData.responseBody.server);
    });
    it('should hold the total number of runs', function () {
      expect(specificServerStatusServerApi.totalNumberOfRuns).toEqual(specificServerServerResponse.serverData.responseBody.runs.totalNumberOfRuns);
    });
    it('should hold the number of completed runs', function () {
      expect(specificServerStatusServerApi.completedNumberOfRuns).toEqual(specificServerServerResponse.serverData.responseBody.runs.completedNumberOfRuns);
    });
    it('should hold the completed tests percent', function () {
      expect(specificServerStatusServerApi.completedTestsPercent).toEqual(specificServerServerResponse.serverData.responseBody.completedTestsPercent);
    });
    it('should hold the completed tests status', function () {
      expect(specificServerStatusServerApi.analysisStatus).toEqual(specificServerServerResponse.serverData.responseBody.analysisStatus);
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
      expect(specificServerStatusServerApi.getRunsDataOfSelectedTest('AppInfo Sanity2', specificServerStatusServerApi.getTestedServerDataForTest)).toEqual(runsDataOfSelectedTest);
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
//      expect(specificServerStatusServerApi.getRunsDataOfSelectedTest('AppInfo Sanity2', specificServerStatusServerApi.getAllServersDataForTest)).toEqual(runsDataOfSelectedTest);
//    });
    it('should be able to get column defs for runs of selected test', function () {
      var cellTemplate = "<div class=\"grid-action-cell\" ng-click=\"serverStatusCtrl.specificServerStatusServerApi.buildGraphByAttribute(col.colDef.field, col.colDef.displayName)\">{{row.entity[col.field]}}</div>";
      var cellTemplateWithDateFilter = "<div class=\"grid-action-cell\" ng-click=\"serverStatusCtrl.specificServerStatusServerApi.buildGraphByAttribute(col.colDef.field, col.colDef.displayName)\">{{row.entity[col.field] | date:'MMM d, y -  H:mm:ss'}}</div>";
      var columnDefs = [
        {
//          cellFilter: "date:'MMM d, y -  H:mm:ss'",
          field: 'runEndTime',
          displayName: 'Run End Time',
          cellTemplate: cellTemplateWithDateFilter
        },
        {
          field: 'errorRate',
          displayName: 'Error Rate',
          cellTemplate: cellTemplate
        },
        {
          field: 'systemError',
          displayName: 'System Error',
          cellTemplate: cellTemplate
        },
        {
          field: 'systemFatal',
          displayName: 'System Fatal',
          cellTemplate: cellTemplate
        }
      ];
      var exampleRow = {
        runEndTime: 1410959637697,
        errorRate: 0,
        serverHostName: "app30.aus.wixpress.com",
        systemError: 0,
        systemFatal: 0
      };
      var runsOfSelectedTestArr = [exampleRow];
      expect(specificServerStatusServerApi.getColumnDefsForRunsOfSelectedTestArr(runsOfSelectedTestArr, true)).toEqual(columnDefs);
    });
    it('should be able to get data for the chart object', function () {
      specificServerStatusServerApi.runsOfSelectedTestAllServersData = [[
        {errorRate: 0,
          serverHostName: "app30.aus.wixpress.com",
          systemError: 3.789,
          systemFatal: 0
        },
        {errorRate: 0,
          serverHostName: "app33.aus.wixpress.com",
          systemError: 4,
          systemFatal: 0
        },
        {errorRate: 0,
          serverHostName: "apu1.aus.wixpress.com",
          systemError: 5,
          systemFatal: 0
        }], [
        {errorRate: 0,
          serverHostName: "app30.aus.wixpress.com",
          systemError: 6,
          systemFatal: 0
        },
        {errorRate: 0,
          serverHostName: "app33.aus.wixpress.com",
          systemError: 7,
          systemFatal: 0
        },
        {errorRate: 0,
          serverHostName: "apu1.aus.wixpress.com",
          systemError: 8,
          systemFatal: 0
        }
      ]];
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
      expect(specificServerStatusServerApi.getChartObjDataForSelectedTest('systemError')).toEqual(chartObjDataForTest);
    });
  });
});
