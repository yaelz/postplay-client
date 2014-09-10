'use strict';

describe('Service: basicTestInfoServerApi', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var $httpBackend, API_URL, basicTestInfoServerApi, serverResponse, serverApiUrl;
  beforeEach(inject(function (_basicTestInfoServerApi_, _$httpBackend_, _serverResponse_, _serverApiUrl_) {
    serverResponse = _serverResponse_;
    serverApiUrl = _serverApiUrl_;
    basicTestInfoServerApi = _basicTestInfoServerApi_;
    $httpBackend = _$httpBackend_;
  }));

  it('should get all artifacts monitored by postplay, and clean up before getting them again', function () {
    API_URL = serverApiUrl.ALL_ARTIFACTS_API_URL;
    var artifactsResponseFromServer = serverResponse.allArtifacts;

    $httpBackend.expectGET(API_URL).respond(200, artifactsResponseFromServer);
    var artifactsJSONResponse = basicTestInfoServerApi.getAllArtifacts();
    expect(artifactsJSONResponse).toEqual([]);

    $httpBackend.flush();
    expect(artifactsJSONResponse).toEqual(artifactsResponseFromServer);
  });

  it('should get all lifecycle builds, and clean up before getting them again', function () {
    API_URL = serverResponse.BUILDS_API_URL;
    var lifecycleBuildResponseFromServer = serverResponse.lifecycleBuilds;

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
    API_URL = serverApiUrl.VER_SUM_API_URL_PREFIX + serverApiUrl.version + '&artifactId=' + serverApiUrl.artifactId + '&groupId=' + serverApiUrl.groupId;
    var versionSummaryResponseFromServer = serverResponse.versionSummary;

    $httpBackend.expectGET(API_URL).respond(200, versionSummaryResponseFromServer);
    var versionSummaryJSONResponse = basicTestInfoServerApi.getVersionSummary(serverApiUrl.version, serverApiUrl.artifactId, serverApiUrl.groupId);
    expect(versionSummaryJSONResponse).toEqual({});

    $httpBackend.flush();
    expect(versionSummaryJSONResponse).toEqual(versionSummaryResponseFromServer);

    $httpBackend.expectGET(API_URL).respond(200, versionSummaryResponseFromServer);
    versionSummaryJSONResponse = basicTestInfoServerApi.getVersionSummary(serverApiUrl.version, serverApiUrl.artifactId, serverApiUrl.groupId);
    expect(versionSummaryJSONResponse).toEqual({});

    $httpBackend.flush();
    expect(versionSummaryJSONResponse).toEqual(versionSummaryResponseFromServer);
  });

  it('should get all artifact versions, and clean up before getting them again', function () {
    var artifactId = 'wix-public-html-renderer-webapp';
    var groupId = 'com.wixpress';
    API_URL = serverApiUrl.ARTIFACT_VERS_API_URL_PREFIX + serverApiUrl.artifactId + '&groupId=' + serverApiUrl.groupId;
    var artifactVersionsResponseFromServer = serverResponse.artifactVersions;

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
  //  api/getCurrentlyRunningArtifacts/json => [ { "artifactId" : "wix-public-html-renderer-webapp", "groupId" : "com.wixpress", "version" : "2.489.0", "server" : null, "artifactName" : null, "totalTests" : 0, "completedTests" : 0, "completedTestsPercent" : 0, "runningTests" : 0, "analysisStatus" : null, "runs" : null, "runStatus" : null, "buildEvent" : null, "analysisComments" : [ ] } ]
});
