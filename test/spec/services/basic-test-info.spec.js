'use strict';

describe('Service: basicTestInfoServerApi', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var $httpBackend, API_URL, basicTestInfoServerApi;
  beforeEach(inject(function (_basicTestInfoServerApi_, _$httpBackend_) {
    basicTestInfoServerApi = _basicTestInfoServerApi_;
    $httpBackend = _$httpBackend_;
  }));

  it('should get all artifacts monitored by postplay, and clean up before getting them again', function () {
    API_URL = '/_api/getAllArtifacts';
    var artifactsResponseFromServer = [
      {monitoredArtifactId: 1, artifactId: 'wix-html-editor-webapp', groupId: 'com.wixpress', version: null, name: '2. Wix Html Editor', dynamic: false, tests: [], testRuns: []},
      {monitoredArtifactId: 31, artifactId: 'wix-public-html-renderer-webapp', groupId: 'com.wixpress', version: null, name: '2. Wix Public Html Renderer', dynamic: false, tests: [], testRuns: []},
      {monitoredArtifactId: 21, artifactId: 'wix-public-war', groupId: 'com.wixpress', version: null, name: 'Wix Public', dynamic: false, tests: [], testRuns: []}
    ];

    $httpBackend.expectGET(API_URL).respond(200, artifactsResponseFromServer);
    var artifactsJSONResponse = basicTestInfoServerApi.getAllArtifacts();
    expect(artifactsJSONResponse).toEqual([]);

    $httpBackend.flush();
    expect(artifactsJSONResponse).toEqual(artifactsResponseFromServer);

//    $httpBackend.expectGET(API_URL).respond(200, artifactsResponseFromServer);
//    artifactsJSONResponse = basicTestInfoServerApi.getAllArtifacts();
//    expect(artifactsJSONResponse).toEqual([]);
//
//    $httpBackend.flush();
//    expect(artifactsJSONResponse).toEqual(artifactsResponseFromServer);
  });

  it('should get all lifecycle builds, and clean up before getting them again', function () {
    API_URL = '/_api/getLifecycleBuilds';
    var lifecycleBuildResponseFromServer = {'2. Wix Html Editor': {'wix-html-editor-webapp': {artifactId: 'wix-html-editor-webapp', groupId: 'com.wixpress'}}};

    $httpBackend.expectGET(API_URL).respond(200, lifecycleBuildResponseFromServer);
    var lifecycleBuildJSONResponse = basicTestInfoServerApi.getLifecycleBuilds();
    expect(lifecycleBuildJSONResponse).toEqual({});
    // TODO toEqual([]) and toEqual({}) will both work! How is it best to check?

    $httpBackend.flush();
    expect(lifecycleBuildJSONResponse).toEqual(lifecycleBuildResponseFromServer);

    $httpBackend.expectGET(API_URL).respond(200, lifecycleBuildResponseFromServer);
    lifecycleBuildJSONResponse = basicTestInfoServerApi.getLifecycleBuilds();
    expect(lifecycleBuildJSONResponse).toEqual({});

    $httpBackend.flush();
    expect(lifecycleBuildJSONResponse).toEqual(lifecycleBuildResponseFromServer);
  });

  it('should get version summary of an artifact, and clean up before getting them again', function () {
    // TODO what exactly is this version summary?
    var version = '2.487.0';
    var artifactId = 'wix-public-html-renderer-webapp';
    var groupId = 'com.wixpress';
    API_URL = '/_api/versionSummary/json?version=' + version + '&artifactId=' + artifactId + '&groupId=' + groupId;
    var versionSummaryResponseFromServer = {code: 0, message: 'OK', comments: null, responseBody:
      [{artifactId: 'wix-public-html-renderer-webapp', groupId: 'com.wixpress', server: 'app30.aus.wixpress.com', version: '2.487.0', analysisResultStatus: 'TEST_FAILED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', errorFields: null, runStatus: 'FINISHED', comments: 'Failed on errorRate', event: 'TESTBED'}]};

    $httpBackend.expectGET(API_URL).respond(200, versionSummaryResponseFromServer);
    var versionSummaryJSONResponse = basicTestInfoServerApi.getVersionSummary(version, artifactId, groupId);
    expect(versionSummaryJSONResponse).toEqual({});

    $httpBackend.flush();
    expect(versionSummaryJSONResponse).toEqual(versionSummaryResponseFromServer);

    $httpBackend.expectGET(API_URL).respond(200, versionSummaryResponseFromServer);
    versionSummaryJSONResponse = basicTestInfoServerApi.getVersionSummary(version, artifactId, groupId);
    expect(versionSummaryJSONResponse).toEqual({});

    $httpBackend.flush();
    expect(versionSummaryJSONResponse).toEqual(versionSummaryResponseFromServer);
  });

  it('should get all artifact versions, and clean up before getting them again', function () {
    var artifactId = 'wix-public-html-renderer-webapp';
    var groupId = 'com.wixpress';
    API_URL = '/_api/getArtifactVersions/json?artifactId=' + artifactId + '&groupId=' + groupId;
    var artifactVersionsResponseFromServer = ['2.470.0', '2.469.0', '2.468.0', '2.467.0', '2.466.0', '2.465.0', '2.464.0', '2.463.0', '2.462.0', '2.461.0'];
    $httpBackend.expectGET(API_URL).respond(200, artifactVersionsResponseFromServer);
    var artifactVersionsJSONResponse = basicTestInfoServerApi.getArtifactVersions(artifactId, groupId);
    expect(artifactVersionsJSONResponse).toEqual([]);

    $httpBackend.flush();
    expect(artifactVersionsJSONResponse).toEqual(artifactVersionsResponseFromServer);

    $httpBackend.expectGET(API_URL).respond(200, artifactVersionsResponseFromServer);
    artifactVersionsJSONResponse = basicTestInfoServerApi.getArtifactVersions(artifactId, groupId);
    expect(artifactVersionsJSONResponse).toEqual([]);
    $httpBackend.flush();
    expect(artifactVersionsJSONResponse).toEqual(artifactVersionsResponseFromServer);
  });

  describe('thereWasServerError should be true iff there was a server error', function () {
    var httpSuccess = 200;
    var httpError = 500;
    function mockHttpBackendResponseAndCallServiceFunction(functionToCheck, status) {
      $httpBackend.expectGET(/.*/).respond(status);
      functionToCheck();
      $httpBackend.flush();
    }

    function checkForHttpSuccessAndError(functionToCheck) {
      expect(basicTestInfoServerApi.thereWasServerError).toBe(false);
      mockHttpBackendResponseAndCallServiceFunction(functionToCheck, httpError);
      expect(basicTestInfoServerApi.thereWasServerError).toBe(true);
      mockHttpBackendResponseAndCallServiceFunction(functionToCheck, httpSuccess);
      expect(basicTestInfoServerApi.thereWasServerError).toBe(false);
    }

    it('in the getArtifactVersions function', function () {
      checkForHttpSuccessAndError(basicTestInfoServerApi.getArtifactVersions);
    });

    it('in the getVersionSummary function', function () {
      checkForHttpSuccessAndError(basicTestInfoServerApi.getVersionSummary);
    });

    it('in the getAllArtifacts function', function () {
      checkForHttpSuccessAndError(basicTestInfoServerApi.getAllArtifacts);
    });

    it('in the getLifecycleBuilds function', function () {
      checkForHttpSuccessAndError(basicTestInfoServerApi.getLifecycleBuilds);
    });
  });
  // TODO:
  //  api/getCurrentlyRunningArtifacts/json => ???
});
