'use strict';

describe('Service: basicTestInfoServerApi', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var $httpBackend, BASIC_API_URL, API_URL, basicTestInfoServerApi, basicTestInfoServerResponse, serverApiUrl;
  beforeEach(inject(function (_basicTestInfoServerApi_, _$httpBackend_, _basicTestInfoServerResponse_, _serverApiUrl_) {
    basicTestInfoServerResponse = _basicTestInfoServerResponse_;
    serverApiUrl = _serverApiUrl_;
    basicTestInfoServerApi = _basicTestInfoServerApi_;
    $httpBackend = _$httpBackend_;
    BASIC_API_URL = serverApiUrl.PREFIX;
  }));

  it('should get all artifacts monitored by postplay', function () {
    API_URL = serverApiUrl.ALL_ARTIFACTS_API_URL;
    checkResponseFromServer(basicTestInfoServerApi.getAllArtifacts, [], basicTestInfoServerResponse.allArtifacts);
  });

  function checkResponseFromServer(functionToEval, valueBeforeServerResponse, responseFromServer, argsForFunc) {
    API_URL = BASIC_API_URL + API_URL;
    $httpBackend.expectGET(API_URL).respond(200, responseFromServer);
    var functionReturnValue = valueBeforeServerResponse;
    // TODO what should I send as 'this' in the apply..?
    functionToEval.apply(undefined, argsForFunc).then(function (response) {
      angular.copy(response.data, functionReturnValue);
    });
    $httpBackend.flush();
    expect(functionReturnValue).toEqual(responseFromServer);
  }

  it('should get all lifecycle builds', function () {
    API_URL = serverApiUrl.BUILDS_API_URL;
    checkResponseFromServer(basicTestInfoServerApi.getLifecycleBuilds, {}, basicTestInfoServerResponse.lifecycleBuilds);
    // TODO toEqual([]) and toEqual({}) will both work! How is it best to check?
  });

  it('should get version summary of an artifact', function () {
    API_URL = serverApiUrl.VER_SUM_API_URL_PREFIX + basicTestInfoServerResponse.version + '&artifactId=' + basicTestInfoServerResponse.artifactId + '&groupId=' + basicTestInfoServerResponse.groupId + '&event=' + basicTestInfoServerResponse.event;
    var argsForFunc = [basicTestInfoServerResponse.version, basicTestInfoServerResponse.artifactId, basicTestInfoServerResponse.groupId, basicTestInfoServerResponse.event];
    checkResponseFromServer(basicTestInfoServerApi.getVersionSummary, [], basicTestInfoServerResponse.versionSummaryForRendererNewVersion, argsForFunc);
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
      mockHttpBackendResponseAndCallServiceFunction(functionToCheck, httpError);
      mockHttpBackendResponseAndCallServiceFunction(functionToCheck, httpSuccess);
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
