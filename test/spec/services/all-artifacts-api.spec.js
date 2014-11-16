'use strict';

describe('Service: allArtifactsApi', function () {

  var version = '2.4.3';
  var artifactId = 'artifact_1';
  var groupId = 'group_1';
  var event = 'EVENT';
  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');
  });

  // instantiate service
  var $httpBackend, API_URL, allArtifactsApi, basicTestInfoServerResponse, serverApiUrl;
  beforeEach(inject(function (_allArtifactsApi_, _$httpBackend_, _basicTestInfoServerResponse_, _serverApiUrl_) {
    basicTestInfoServerResponse = _basicTestInfoServerResponse_;
    serverApiUrl = _serverApiUrl_;
    allArtifactsApi = _allArtifactsApi_;
    $httpBackend = _$httpBackend_;
  }));

  function checkFunctionReturnValueIs(functionToEval, responseFromServer) {
    $httpBackend.expectGET(API_URL).respond(200, responseFromServer);
    var functionReturnValue;
    functionToEval.apply(undefined, [version, artifactId, groupId, event]).then(function (response) {
      functionReturnValue = response.data;
    });
    $httpBackend.flush();
    expect(functionReturnValue).toEqual(responseFromServer);
  }
  it('should get all artifacts monitored by postplay', function () {
    API_URL = serverApiUrl.PREFIX + serverApiUrl.LATEST_ARTIFACTS_API_URI;
    var allArtifacts = [
      {artifactId: 'wix-html-artifact1', groupId: 'com.wixpress', version: '2.487.0'},
      {artifactId: 'wix-html-artifact2', groupId: 'com.wixpress', version: '2.499.0'}
    ];

    // TODO THIS IS ONE WAY, the other test is written the other way!!! Which is better..?
    $httpBackend.expectGET(API_URL).respond(200, allArtifacts);
    var functionReturnValue;
    allArtifactsApi.getAllArtifacts().then(function (response) {
      functionReturnValue = response.data;
    });
    $httpBackend.flush();
    expect(functionReturnValue).toEqual(allArtifacts);
  });

  it('should get version summary of an artifact', function () {
    API_URL = serverApiUrl.PREFIX + serverApiUrl.VER_SUM_API_URL_PREFIX + version + '&artifactId=' + artifactId + '&groupId=' + groupId + '&event=' + event;
    var versionSummary = [
      {
        artifactId: 'wix-html-editor-webapp',
        groupId: 'com.wixpress',
        server: 'app18.aus.wixpress.com',
        version: '2.490.0',
        analysisResultEnum: 'TEST_FAILED',
        testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY',
        runStatus: 'FINISHED',
        event: 'TESTBED'
      }
    ];
    checkFunctionReturnValueIs(allArtifactsApi.getVersionSummary, versionSummary);
  });

});
