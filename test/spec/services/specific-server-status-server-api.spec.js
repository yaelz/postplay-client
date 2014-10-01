'use strict';

describe('Service: specificServerStatusServerApi', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var specificServerStatusServerApi, $httpBackend, serverApiUrl, specificServerServerResponse, specificServerData, $rootScope;
  beforeEach(inject(function (_specificServerStatusServerApi_, _$httpBackend_, _serverApiUrl_, _specificServerServerResponse_, _specificServerData_, _$rootScope_) {
    specificServerStatusServerApi = _specificServerStatusServerApi_;
    $httpBackend = _$httpBackend_;
    serverApiUrl = _serverApiUrl_;
    specificServerServerResponse = _specificServerServerResponse_;
    specificServerData = _specificServerData_;
    $rootScope = _$rootScope_;
  }));

  function callGetServerStatusMethodAndFlushHttpBackend() {
    var API_URL = serverApiUrl.SERVER_STATUS_API_URL_PREFIX + specificServerServerResponse.serverData.responseBody.server + '&artifactId=' + specificServerServerResponse.serverData.responseBody.artifactId + '&groupId=' + specificServerServerResponse.serverData.responseBody.groupId;
    $httpBackend.expectGET(API_URL).respond(200, specificServerServerResponse.serverData);
    specificServerStatusServerApi.getServerData(specificServerServerResponse.serverData.responseBody.server, specificServerServerResponse.serverData.responseBody.artifactId, specificServerServerResponse.serverData.responseBody.groupId);
    $httpBackend.flush();
  }

  it('should get the server\'s status', function () {
    expect(specificServerStatusServerApi.serverResponseBody).toEqual({});
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.serverResponseBody).toEqual(specificServerServerResponse.serverData.responseBody);
  });
  it('should know whether the data is loaded or not', function () {
    expect(specificServerStatusServerApi.isDataLoaded).toBe(false);
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.isDataLoaded).toBe(true);
  });
  it('should hold the artifactId after getting the server status data from the server', function () {
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.getArtifactId()).toEqual(specificServerServerResponse.serverData.responseBody.artifactId);
  });
  it('should hold the artifactName after getting the server status data from the server', function () {
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.getArtifactName()).toEqual(specificServerServerResponse.serverData.responseBody.artifactName);
  });
  it('should hold the version after getting the server status data from the server', function () {
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.getVersion()).toEqual(specificServerServerResponse.serverData.responseBody.version);
  });
  it('should hold the server name after getting the server status data from the server', function () {
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.getServerName()).toEqual(specificServerServerResponse.serverData.responseBody.server);
  });
  it('should hold the runs after getting the server status data from the server', function () {
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.getRuns()).toEqual(specificServerServerResponse.serverData.responseBody.runs.runs);
  });
  it('should hold the total number of runs after getting the server status data from the server', function () {
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.getTotalNumberOfRuns()).toEqual(specificServerServerResponse.serverData.responseBody.runs.totalNumberOfRuns);
  });
  it('should hold the number of completed runs after getting the server status data from the server', function () {
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.getNumberOfCompletedRuns()).toEqual(specificServerServerResponse.serverData.responseBody.runs.completedNumberOfRuns);
  });
  it('should hold the completed tests percent after getting the server status data from the server', function () {
    callGetServerStatusMethodAndFlushHttpBackend();
    expect(specificServerStatusServerApi.getCompletedTestsPercent()).toEqual(specificServerServerResponse.serverData.responseBody.completedTestsPercent);
  });
});
