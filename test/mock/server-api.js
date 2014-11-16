'use strict';

angular.module('postplayTryAppMocks', ['ngMockE2E'])
  .service('serverLogic', function () {
    this.getAllArtifacts = function () {
      return [
        {artifactId: 'wix-html-editor-webapp13', groupId: 'com.wixpress', version: '2.490.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED', startTime: 1414663552086},
        {artifactId: 'wix-html-editor-webapp3', groupId: 'com.wixpress', version: '2.490.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED', startTime: 1414663552086},
        {artifactId: 'wix-html-editor-webapp2', groupId: 'com.wixpress', version: '2.490.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED', startTime: 1414663552086},
        {artifactId: 'wix-html-editor-webapp1', groupId: 'com.wixpress', version: '2.490.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED', startTime: 1414663552086},
        {artifactId: 'wix-html-artifact1', groupId: 'com.wixpress', version: '2.487.7', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_FAILED', startTime: 1414663552086},
        {artifactId: 'wix-html-artifact2', groupId: 'com.wixpress', version: '2.487.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_FAILED', startTime: 1414663552086}
      ];
    };
    this.getVersionSummary = function () {
      return [
        {
          artifactId: 'wix-html-editor-webapp',
          groupId: 'com.wixpress',
          server: 'app18.aus.wixpress.com',
          version: '2.490.0',
          analysisResultEnum: 'TEST_FAILED',
          testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY',
          errorFields: null,
          runStatus: 'FINISHED',
          comments: 'Failed on errorRate. Failed on systemError',
          event: 'TESTBED'
        }
      ];
    };
    this.getSpecificVersionSummary = function () {
      return {
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
      };
    };
  })
  .run(function ($httpBackend, serverApiUrl, serverLogic) {
    $httpBackend.whenGET(serverApiUrl.PREFIX + serverApiUrl.ALL_ARTIFACTS_API_URL).respond(function () {
      return [200, serverLogic.getAllArtifacts()];
    });
    //TODO How can I make this work with changed arguments?
    $httpBackend.whenGET(serverApiUrl.PREFIX + serverApiUrl.VER_SUM_API_URL_PREFIX + '2.487.7' + '&artifactId=' + 'wix-html-artifact1' + '&groupId=' + 'com.wixpress' + '&event=' + 'TESTBED').respond(function () {
      return [200, serverLogic.getVersionSummary()];
    });
    $httpBackend.whenGET(serverApiUrl.PREFIX + serverApiUrl.SERVER_STATUS_API_URL_PREFIX + 'app18.aus.wixpress.com' + '&artifactId=' + 'wix-html-editor-webapp' + '&groupId=' + 'com.wixpress').respond(function () {
      return [200, serverLogic.getSpecificVersionSummary()];
    });

    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
  });
