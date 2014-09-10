'use strict';

//add services, directives, controllers, filters, etc. in this module
//avoid adding module dependencies for this module
angular
  .module('postplayTryAppInternal', [])
  .constant('serverResponse', {
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
  .constant('serverApiUrl', {
    version: '2.487.0',
    artifactId: 'wix-public-html-renderer-webapp',
    groupId: 'com.wixpress',
    ALL_ARTIFACTS_API_URL: '/_api/getAllArtifacts',
    CURRENTLY_RUNNING_ARTIFACTS_API_URL: '/_api/getCurrentlyRunningArtifacts/json',
    BUILDS_API_URL: '/_api/getLifecycleBuilds',
    VER_SUM_API_URL_PREFIX: '/_api/versionSummary/json?version=',
    ARTIFACT_VERS_API_URL_PREFIX: '/_api/getArtifactVersions/json?artifactId='
  });

//add module dependencies & config and run blocks in this module
//load only the internal module in tests and mock any module dependency
//the only exception to load this module in tests in to test the config & run blocks
angular
  .module('postplayTryApp', ['postplayTryAppInternal', 'postplayTryTranslations', 'wixAngular'])
  .config(function () {
    return;
  });
