'use strict';

describe('Service: versionTestResults', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var $httpBackend, API_URL, versionTestResults;
  beforeEach(inject(function (_versionTestResults_, _$httpBackend_) {
    versionTestResults = _versionTestResults_;
    $httpBackend = _$httpBackend_;
  }));

  it('should get all artifacts monitored by postplay', function () {
    API_URL = '/_api/getAllArtifacts';
    var artifactsResponseFromServer = [
      {monitoredArtifactId: 1, artifactId: 'wix-html-editor-webapp', groupId: 'com.wixpress', version: null, name: '2. Wix Html Editor', dynamic: false, tests: [], testRuns: []},
      {monitoredArtifactId: 31, artifactId: 'wix-public-html-renderer-webapp', groupId: 'com.wixpress', version: null, name: '2. Wix Public Html Renderer', dynamic: false, tests: [], testRuns: []},
      {monitoredArtifactId: 21, artifactId: 'wix-public-war', groupId: 'com.wixpress', version: null, name: 'Wix Public', dynamic: false, tests: [], testRuns: []}
    ];

    $httpBackend.expectGET(API_URL).respond(200, artifactsResponseFromServer);
    var artifactsJSONResponse = versionTestResults.getAllArtifacts();
    expect(artifactsJSONResponse).toEqual([]);

    $httpBackend.flush();
    expect(artifactsJSONResponse).toEqual(artifactsResponseFromServer);
  });

  it('should get all lifecycle builds', function () {
    API_URL = '/_api/getLifecycleBuilds';
    var lifecycleBuildResponseFromServer = {'2. Wix Html Editor': {'wix-html-editor-webapp': {artifactId: 'wix-html-editor-webapp', groupId: 'com.wixpress'}}};

    $httpBackend.expectGET(API_URL).respond(200, lifecycleBuildResponseFromServer);
    var lifecycleBuildJSONResponse = versionTestResults.getLifecycleBuilds();
    expect(lifecycleBuildJSONResponse).toEqual({});
    // TODO toEqual([]) and toEqual({}) will both work! How is it best to check?

    $httpBackend.flush();
    expect(lifecycleBuildJSONResponse).toEqual(lifecycleBuildResponseFromServer);
  });

  it('should get version summary of an artifact', function () {
    // TODO what exactly is this version summary?
    var version = '2.487.0';
    var artifactId = 'wix-public-html-renderer-webapp';
    var groupId = 'com.wixpress';
    API_URL = '/_api/versionSummary/json?version=' + version + '&artifactId=' + artifactId + '&groupId=' + groupId;
    var versionSummaryResponseFromServer = {code: 0, message: 'OK', comments: null, responseBody:
                                                    [{artifactId: 'wix-public-html-renderer-webapp', groupId: 'com.wixpress', server: 'app30.aus.wixpress.com', version: '2.487.0', analysisResultStatus: 'TEST_FAILED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', errorFields: null, runStatus: 'FINISHED', comments: 'Failed on errorRate', event: 'TESTBED'}]};

    $httpBackend.expectGET(API_URL).respond(200, versionSummaryResponseFromServer);
    var versionSummaryJSONResponse = versionTestResults.getVersionSummary(version, artifactId, groupId);
    expect(versionSummaryJSONResponse).toEqual({});

    $httpBackend.flush();
    expect(versionSummaryJSONResponse).toEqual(versionSummaryResponseFromServer);
  });

  it('should get all artifact versions', function () {
    var artifactId = 'wix-public-html-renderer-webapp';
    var groupId = 'com.wixpress';
    API_URL = '/_api/getArtifactVersions/json?artifactId=' + artifactId + '&groupId=' + groupId;
    var artifactVersionsResponseFromServer = ['2.470.0', '2.469.0', '2.468.0', '2.467.0', '2.466.0', '2.465.0', '2.464.0', '2.463.0', '2.462.0', '2.461.0'];
    $httpBackend.expectGET(API_URL).respond(200, artifactVersionsResponseFromServer);
    var artifactVersionsJSONResponse = versionTestResults.getArtifactVersions(artifactId, groupId);
    expect(artifactVersionsJSONResponse).toEqual([]);

    $httpBackend.flush();
    expect(artifactVersionsJSONResponse).toEqual(artifactVersionsResponseFromServer);
  });

  // TODO:
  //  api/getCurrentlyRunningArtifacts/json => ???
});
