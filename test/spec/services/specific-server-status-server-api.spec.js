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

  describe('After getting the server status', function () {
    beforeEach(function () {
      callGetServerStatusMethodAndFlushHttpBackend();
    });
    it('should hold the runs', function () {
      expect(specificServerStatusServerApi.runs).toEqual(specificServerServerResponse.serverData.responseBody.runs.runs);
    });
    it('should hold the tests data for a specific run', function () {
      var selectedRow = {entity: specificServerServerResponse.serverData.responseBody.runs.runs[0]};
      specificServerStatusServerApi.runsTableData.beforeSelectionChange(selectedRow);
      expect(specificServerStatusServerApi.testsBasicTableData).toEqual(specificServerServerResponse.serverData.responseBody.runs.runs[0].tests);
    });
    it('should be able to get the test names', function () {
      expect(specificServerStatusServerApi.testNames).toEqual([{testName: 'AppInfo Sanity2'}, {testName: 'AppInfo Sanity'}]);
    });
    it('should be able to get the artifactId', function () {
      expect(specificServerStatusServerApi.getArtifactId()).toEqual(specificServerServerResponse.serverData.responseBody.artifactId);
    });
    it('should be able to get the artifactName', function () {
      expect(specificServerStatusServerApi.getArtifactName()).toEqual(specificServerServerResponse.serverData.responseBody.artifactName);
    });
    it('should be able to get the version', function () {
      expect(specificServerStatusServerApi.getVersion()).toEqual(specificServerServerResponse.serverData.responseBody.version);
    });
    it('should be able to get the server name', function () {
      expect(specificServerStatusServerApi.getServerName()).toEqual(specificServerServerResponse.serverData.responseBody.server);
    });
    it('should be able to get the total number of runs', function () {
      expect(specificServerStatusServerApi.getTotalNumberOfRuns()).toEqual(specificServerServerResponse.serverData.responseBody.runs.totalNumberOfRuns);
    });
    it('should be able to get the number of completed runs', function () {
      expect(specificServerStatusServerApi.getNumberOfCompletedRuns()).toEqual(specificServerServerResponse.serverData.responseBody.runs.completedNumberOfRuns);
    });
    it('should be able to get the completed tests percent', function () {
      expect(specificServerStatusServerApi.getCompletedTestsPercent()).toEqual(specificServerServerResponse.serverData.responseBody.completedTestsPercent);
    });
    it('should be able to get the completed tests status', function () {
      expect(specificServerStatusServerApi.getCompletedTestsStatus()).toEqual(specificServerServerResponse.serverData.responseBody.analysisStatus);
    });
  });
});
