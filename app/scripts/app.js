'use strict';

angular
  .module('postplayTryAppInternal', ['ngGrid', 'ngAnimate', 'googlechart', 'ui.bootstrap'])
  .constant('basicTestInfoServerResponse', {
    allArtifacts: [
      {artifactId: 'wix-html-editor-webapp', groupId: 'com.wixpress', version: '2.490.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED', startTime: 1414663552086},
      {artifactId: 'wix-html-artifact1', groupId: 'com.wixpress', version: '2.487.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_FAILED', startTime: 1414663552086},
      {artifactId: 'wix-html-artifact1', groupId: 'com.wixpress', version: '2.487.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_FAILED', startTime: 1414663552086}
    ]
  })
  .constant('specificServerServerResponse', {
    serverData: {
      artifactId: 'wix-public-html-renderer-webapp',
      groupId: 'com.wixpress',
      version: '2.492.0',
      server: 'app30.aus.wixpress.com',
      artifactName: '2. Wix Public Html Renderer',
      totalTests: 13,
      completedTests: 13,
      completedTestsPercent: 50,
      runningTests: 0,
      analysisStatus: 'TEST_FAILED',
      runs: {
        totalNumberOfRuns: 10,
        completedNumberOfRuns: 10,
        numberOfFutureRuns: 0,
        runs: [
          {
            runStatus: 'FINISHED',
            plannedExecutionTimeUtc: 1410959618239,
            imageCaption: 1,
            tests: [
              {
                name: 'AppInfo Sanity',
                testStatus: 'STATUS_COMPLETED_SUCCESSFULLY',
                analysisResultStatus: 'TEST_PASSED',
                analysisResultComments: 'Passed',
                resultsForDisplay: '{ "testedServer" : { "systemError": 0.0, "serverHostName": "app30.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0}, "referenceServers": [ { "systemError": 0.0, "serverHostName": "app33.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0} ]}',
                referenceServerTest: true,
                errorFields: '',
                testErrors: null,
                testWarnings: null
              },
              {
                name: 'AppInfo Sanity2',
                testStatus: 'STATUS_COMPLETED_SUCCESSFULLY',
                analysisResultStatus: 'TEST_PASSED',
                analysisResultComments: 'Passed',
                resultsForDisplay: '{ "testedServer" : { "systemError": 3.789, "serverHostName": "app30.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0}, "referenceServers": [ { "systemError": 4.0, "serverHostName": "app33.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0}, { "systemError": 5.0, "serverHostName": "apu1.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0} ]}',
                referenceServerTest: true,
                errorFields: '',
                testErrors: null,
                testWarnings: null
              }
            ],
            startTime: 1410959635683,
            endTime: 1410959637697,
            analysisStatus: 'TEST_PASSED',
            analysisComments: [],
            executionErrors: false,
            numberOfTests: 3
          },
          {
            runStatus: 'FINISHED',
            plannedExecutionTimeUtc: 1410959678239,
            imageCaption: 1,
            tests: [
              {
                name: 'AppInfo Sanity2',
                testStatus: 'STATUS_COMPLETED_SUCCESSFULLY',
                analysisResultStatus: 'TEST_PASSED',
                analysisResultComments: 'Passed',
                resultsForDisplay: '{ "testedServer" : { "systemError": 6.0, "serverHostName": "app30.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.1}, "referenceServers": [ { "systemError": 7.0, "serverHostName": "app33.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0}, { "systemError": 8.0, "serverHostName": "apu1.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0} ]}',
                referenceServerTest: true,
                errorFields: '',
                testErrors: null,
                testWarnings: null
              },
              {
                name: 'Another test',
                testStatus: 'STATUS_COMPLETED_SUCCESSFULLY',
                analysisResultStatus: 'TEST_FAILED',
                analysisResultComments: 'Failed on throughputTotalCalls',
                resultsForDisplay: '{ "testedServer" : { "systemError": 0.0, "serverHostName": "app30.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0}, "referenceServers": [ { "systemError": 0.0, "serverHostName": "app33.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0}, { "systemError": 0.0, "serverHostName": "apu1.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0} ]}',
                referenceServerTest: true,
                errorFields: '',
                testErrors: null,
                testWarnings: null
              },
              {
                name: 'Yet Another test',
                testStatus: 'STATUS_COMPLETED_SUCCESSFULLY',
                analysisResultStatus: 'TEST_PASSED',
                analysisResultComments: 'Passed',
                resultsForDisplay: '{ "testedServer" : { "systemError": 0.0, "serverHostName": "app30.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0}, "referenceServers": [ { "systemError": 0.0, "serverHostName": "app33.aus.wixpress.com", "systemFatal": 0.0, "errorRate": 0.0} ]}',
                referenceServerTest: true,
                errorFields: '',
                testErrors: null,
                testWarnings: null
              }
            ],
            startTime: 1410959695683,
            endTime: 1410959697696,
            analysisStatus: 'TEST_FAILED',
            analysisComments: [],
            executionErrors: false,
            numberOfTests: 2
          }
        ]
      },
      runStatus: 'RUNNING',
      buildEvent: 'TESTBED',
      analysisComments: [
        'Failed on throughputTotalCalls'
      ]
    }
  })
  .constant('serverApiUrl', {
//    PREFIX: 'http://localhost:8080/api/v2/',
    PREFIX: '',
    LATEST_ARTIFACTS_API_URI: 'getLatestMonitoredArtifactsEventSummary',
    VER_SUM_API_URL_PREFIX: 'versionSummary?version=',
    CURRENTLY_RUNNING_ARTIFACTS_API_URL: 'getCurrentlyRunningArtifacts/json',
    CURRENTLY_RUNNING_TESTS_API_URL: 'getCurrentlyRunningTests/json',
//    FIELD_MAP_API_URL: 'fieldMap',
    SERVER_STATUS_API_URL_PREFIX: 'latestServerData?server='
  });

//add module dependencies & config and run blocks in this module
//load only the internal module in tests and mock any module dependency
//the only exception to load this module in tests in to test the config & run blocks
angular
  .module('postplayTryApp', ['postplayTryAppInternal', 'postplayTryTranslations', 'wixAngular', 'ngRoute'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/artifactId/:artifactId/server/:server/groupId/:groupId/event/:event', {
        templateUrl: 'views/server-status.html',
        controller: 'SpecificServerStatusController',
        controllerAs: 'serverStatusCtrl',
        resolve: {
          serverStatusCtrlDTO: ['$route', function ($route) {
            return {
              artifactId: $route.current.params.artifactId,
              groupId: $route.current.params.groupId,
              server: $route.current.params.server,
              event: $route.current.params.event
            };
          }]
        }
      })
      .when('/', {
        templateUrl: 'views/general-status.html',
        controller: 'BasicTestInfoController',
        controllerAs: 'basicTestInfoCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
