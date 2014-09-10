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

  function checkResponseFromServer(functionToEval, valueBeforeServerResponse, responseFromServer, argsForFunc) {
    function checkResponseFromServerOnce() {
      $httpBackend.expectGET(API_URL).respond(200, responseFromServer);
    // TODO what should I send as 'this' in the apply..?
      var lifecycleBuildJSONResponse = functionToEval.apply(basicTestInfoServerApi, argsForFunc);
      expect(lifecycleBuildJSONResponse).toEqual(valueBeforeServerResponse);
      $httpBackend.flush();
      expect(lifecycleBuildJSONResponse).toEqual(responseFromServer);
    }
    checkResponseFromServerOnce();
    checkResponseFromServerOnce();
  }

  it('should get all lifecycle builds, and clean up before getting them again', function () {
    API_URL = serverResponse.BUILDS_API_URL;
    checkResponseFromServer(basicTestInfoServerApi.getLifecycleBuilds, {}, serverResponse.lifecycleBuilds);
    // TODO toEqual([]) and toEqual({}) will both work! How is it best to check?
  });

  it('should get version summary of an artifact, and clean up before getting them again', function () {
    API_URL = serverApiUrl.VER_SUM_API_URL_PREFIX + serverApiUrl.version + '&artifactId=' + serverApiUrl.artifactId + '&groupId=' + serverApiUrl.groupId;
    var argsForFunc = [serverApiUrl.version, serverApiUrl.artifactId, serverApiUrl.groupId];
    checkResponseFromServer(basicTestInfoServerApi.getVersionSummary, {}, serverResponse.versionSummary, argsForFunc);
  });

  it('should get all artifact versions, and clean up before getting them again', function () {
    API_URL = serverApiUrl.ARTIFACT_VERS_API_URL_PREFIX + serverApiUrl.artifactId + '&groupId=' + serverApiUrl.groupId;
    var argsForFunc = [serverApiUrl.artifactId, serverApiUrl.groupId];
    checkResponseFromServer(basicTestInfoServerApi.getArtifactVersions, {}, serverResponse.artifactVersions, argsForFunc);
  });

  it('should get all currently running artifacts', function () {
    API_URL = serverApiUrl.CURRENTLY_RUNNING_ARTIFACTS_API_URL;
    checkResponseFromServer(basicTestInfoServerApi.getCurrentlyRunningArtifacts, [], serverResponse.currentlyRunningArtifacts);
  });

  describe('thereWasServerError variable should be true iff there was a server error', function () {
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
});
