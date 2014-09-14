'use strict';

//add services, directives, controllers, filters, etc. in this module
//avoid adding module dependencies for this module
angular
  .module('postplayTryAppInternal', [])
  .constant('basicTestInfoServerResponse', {
    artifactVersions: ['2.487.0', '2.469.0', '2.468.0', '2.467.0', '2.466.0', '2.465.0', '2.464.0', '2.463.0', '2.462.0', '2.461.0'],
    allArtifacts: [
      {monitoredArtifactId: 1, artifactId: 'wix-html-editor-webapp', groupId: 'com.wixpress', version: null, name: '2. Wix Html Editor', dynamic: false, tests: [], testRuns: []},
      {monitoredArtifactId: 31, artifactId: 'wix-public-html-renderer-webapp', groupId: 'com.wixpress', version: null, name: '2. Wix Public Html Renderer', dynamic: false, tests: [], testRuns: []},
      {monitoredArtifactId: 21, artifactId: 'wix-public-war', groupId: 'com.wixpress', version: null, name: 'Wix Public', dynamic: false, tests: [], testRuns: []}
    ],
    versionSummary: {
      code: 0,
      message: 'OK',
      comments: null,
      responseBody: [{
        artifactId: 'wix-public-html-renderer-webapp',
        groupId: 'com.wixpress',
        server: 'app30.aus.wixpress.com',
        version: '2.487.0',
        analysisResultStatus: 'TEST_FAILED',
        testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY',
        errorFields: null,
        runStatus: 'FINISHED',
        comments: 'Failed on errorRate',
        event: 'TESTBED'
      }]
    },
    lifecycleBuilds: {
      '2. Wix Html Editor': {'wix-html-editor-webapp': {artifactId: 'wix-html-editor-webapp', groupId: 'com.wixpress'}}
    },
    currentlyRunningArtifacts: [
      {artifactId: 'wix-public-html-renderer-webapp',
        groupId: 'com.wixpress',
        version: '2.489.0',
        server: null,
        artifactName: null,
        totalTests: 0,
        completedTests: 0,
        completedTestsPercent: 0,
        runningTests: 0,
        analysisStatus: null,
        runs: null,
        runStatus: null,
        buildEvent: null,
        analysisComments: []
      },
      {artifactId: 'wix-public-my-app-keiloo',
        groupId: 'com.wixpress',
        version: '200.489.0',
        server: null,
        artifactName: null,
        totalTests: 0,
        completedTests: 0,
        completedTestsPercent: 0,
        runningTests: 0,
        analysisStatus: null,
        runs: null,
        runStatus: null,
        buildEvent: null,
        analysisComments: []
      }
    ]
  })
  .constant('dashboardServerResponse', {
    currentlyRunningTests: {
      code: 0,
      message: 'OK',
      comments: null,
      responseBody: []
    },
    fieldMap: {
      throughputTotalCalls: 'Throughput Total Calls',
      systemError: 'System Error Rate',
      rps: 'Requests Per Seconds',
      totalIncomingCalls: 'Total Incoming Calls',
      businessWarning: 'Business Warning Rate',
      systemRecoverable: 'System Recoverable Rate',
      totalIncomingSuccessfulCalls: 'Total Incoming Successful Calls',
      businessFatal: 'Business Fatal Rate',
      systemWarning: 'System Warning Rate',
      systemFatal: 'System Fatal Rate',
      businessRecoverable: 'Business Recoverable Rate',
      businessError: 'Business Error Rate',
      errorRate: 'Error Rate'
    }
  })
  .constant('systemConfigurationServerResponse', {
    testDataByTestId21: {
      monitorTestId: 21,
      monitoredArtifactId: 31,
      name: 'AppInfo Sanity',
      implementationClass: 'com.wixpress.postplay.monitoredtest.tests.AppInfoCustomTest',
      runEveryMinute: 1,
      times: 10,
      delayInMinutes: 2,
      inputParams: [],
      validationExpressions: [{
        name: 'Error rate',
        monitorTestId: 21,
        expression: 'errorRate > HIGHEST ^ -5%',
        validationExpressionId: 71,
        deleted: false
      }],
      monitorTestQueueId: 0,
      active: true,
      defaultTest: false,
      deleted: false,
      reference: true,
      useBaseline: false
    },
    testDataByTestId31: {
      monitorTestId: 31,
      monitoredArtifactId: 31,
      name: 'AppInfo Sanity2',
      implementationClass: 'com.wixpress.postplay.monitoredtest.tests.AppInfoCustomTest',
      runEveryMinute: 1,
      times: 3,
      delayInMinutes: 8,
      inputParams: [],
      validationExpressions: [{
        name: 'Throughput',
        monitorTestId: 31,
        expression: 'throughputTotalCalls < LOWEST',
        validationExpressionId: 81,
        deleted: false
      }],
      monitorTestQueueId: 0,
      active: true,
      defaultTest: false,
      deleted: false,
      reference: true,
      useBaseline: false
    },
    artifactData: {
      monitoredArtifactId: 31,
      artifactId: 'wix-public-html-renderer-webapp',
      groupId: 'com.wixpress',
      version: null,
      name: '2. Wix Public Html Renderer',
      dynamic: false,
      tests: [{
        monitorTestId: 21,
        monitoredArtifactId: 31,
        name: 'AppInfo Sanity',
        implementationClass: 'com.wixpress.postplay.monitoredtest.tests.AppInfoCustomTest',
        runEveryMinute: 1,
        times: 10,
        delayInMinutes: 2,
        inputParams: [],
        validationExpressions: [],
        monitorTestQueueId: 0,
        active: true,
        defaultTest: false,
        deleted: false,
        reference: true,
        useBaseline: false
      },
      {
        monitorTestId: 31,
        monitoredArtifactId: 31,
        name: 'AppInfo Sanity2',
        implementationClass: 'com.wixpress.postplay.monitoredtest.tests.AppInfoCustomTest',
        runEveryMinute: 1,
        times: 3,
        delayInMinutes: 8,
        inputParams: [],
        validationExpressions: [],
        monitorTestQueueId: 0,
        active: true,
        defaultTest: false,
        deleted: false,
        reference: true,
        useBaseline: false
      }],
      testRuns: []
    }
  })
  .constant('serverApiUrl', {
    version: '2.487.0',
    artifactId: 'wix-public-html-renderer-webapp',
    groupId: 'com.wixpress',
    ALL_ARTIFACTS_API_URL: '/_api/getAllArtifacts',
    CURRENTLY_RUNNING_ARTIFACTS_API_URL: '/_api/getCurrentlyRunningArtifacts/json',
    BUILDS_API_URL: '/_api/getLifecycleBuilds',
    VER_SUM_API_URL_PREFIX: '/_api/versionSummary/json?version=',
    ARTIFACT_VERS_API_URL_PREFIX: '/_api/getArtifactVersions/json?artifactId=',
    CURRENTLY_RUNNING_TESTS_API_URL: '/_api/getCurrentlyRunningTests/json',
    FIELD_MAP_API_URL: '/_api/fieldMap',
    TEST_DATA_BY_ID_API_URL_PREFIX: '_api/getTest',
    ARTIFACT_DATA_API_URL_PREFIX: '_api/getArtifact'
  });

//add module dependencies & config and run blocks in this module
//load only the internal module in tests and mock any module dependency
//the only exception to load this module in tests in to test the config & run blocks
angular
  .module('postplayTryApp', ['postplayTryAppInternal', 'postplayTryTranslations', 'wixAngular'])
  .config(function () {
    return;
  });
