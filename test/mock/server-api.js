'use strict';

angular.module('postplayTryAppMocks', ['ngMockE2E'])
  .run(function ($httpBackend) {
    var ARTIFACTS_API_URL = '/_api/getAllArtifacts';
    var artifactsResponseFromServer = [
      {monitoredArtifactId: 1, artifactId: 'wix-html-editor-webapp', groupId: 'com.wixpress', version: null, name: '2. Wix Html Editor', dynamic: false, tests: [], testRuns: []},
      {monitoredArtifactId: 31, artifactId: 'wix-public-html-renderer-webapp', groupId: 'com.wixpress', version: null, name: '2. Wix Public Html Renderer', dynamic: false, tests: [], testRuns: []},
      {monitoredArtifactId: 21, artifactId: 'wix-public-war', groupId: 'com.wixpress', version: null, name: 'Wix Public', dynamic: false, tests: [], testRuns: []}
    ];
    $httpBackend.whenGET(ARTIFACTS_API_URL).respond(artifactsResponseFromServer);

    var BUILDS_API_URL = '/_api/getLifecycleBuilds';
    var lifecycleBuildResponseFromServer = {'2. Wix Html Editor': {'wix-html-editor-webapp': {artifactId: 'wix-html-editor-webapp', groupId: 'com.wixpress'}}};
    $httpBackend.whenGET(BUILDS_API_URL).respond(lifecycleBuildResponseFromServer);

    var version = '2.487.0';
    var artifactId = 'wix-public-html-renderer-webapp';
    var groupId = 'com.wixpress';
    var VER_SUM_API_URL = '/_api/versionSummary/json?version=' + version + '&artifactId=' + artifactId + '&groupId=' + groupId;
    var versionSummaryResponseFromServer = {code: 0, message: 'OK', comments: null, responseBody:
      [{artifactId: 'wix-public-html-renderer-webapp', groupId: 'com.wixpress', server: 'app30.aus.wixpress.com', version: '2.487.0', analysisResultStatus: 'TEST_FAILED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', errorFields: null, runStatus: 'FINISHED', comments: 'Failed on errorRate', event: 'TESTBED'}, {artifactId: 'wix-public-html-renderer-webapp', groupId: 'com.wixpress', server: 'app30.aus.wixpress.com', version: '2.487.0', analysisResultStatus: 'TEST_FAILED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', errorFields: null, runStatus: 'FINISHED', comments: 'Failed on errorRate', event: 'TESTBED'}]};
    $httpBackend.whenGET(VER_SUM_API_URL).respond(versionSummaryResponseFromServer);

    var ARTIFACT_VERS_API_URL = '/_api/getArtifactVersions/json?artifactId=' + artifactId + '&groupId=' + groupId;
    var artifactVersionsResponseFromServer = ['2.487.0', '2.469.0', '2.468.0', '2.467.0', '2.466.0', '2.465.0', '2.464.0', '2.463.0', '2.462.0', '2.461.0'];
    $httpBackend.whenGET(ARTIFACT_VERS_API_URL).respond(artifactVersionsResponseFromServer);

    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
  });
