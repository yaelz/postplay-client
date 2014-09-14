'use strict';

describe('Service: systemConfigurationServerApi', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var systemConfigurationServerApi, systemConfigurationServerResponse, $httpBackend, serverApiUrl;
  beforeEach(inject(function (_systemConfigurationServerApi_, _systemConfigurationServerResponse_, _$httpBackend_, _serverApiUrl_) {
    systemConfigurationServerApi = _systemConfigurationServerApi_;
    systemConfigurationServerResponse = _systemConfigurationServerResponse_;
    $httpBackend = _$httpBackend_;
    serverApiUrl = _serverApiUrl_;
  }));

  function checkResponseFromServerHttp(API_URL, serverResponse, valueBeforeServerResponse, serviceFuncToApply, functionArgs) {
    // TODO same function in all server apis! Refactor?
    $httpBackend.expectGET(API_URL).respond(200, serverResponse);
    var functionReturnValue = serviceFuncToApply.apply(systemConfigurationServerApi, functionArgs);
    expect(functionReturnValue).toEqual(valueBeforeServerResponse);
    $httpBackend.flush();
    expect(functionReturnValue).toEqual(serverResponse);
    return functionReturnValue;
  }

  it('should get test data by the test id', function () {
    var testId = 21;
    checkResponseFromServerHttp(
      serverApiUrl.TEST_DATA_BY_ID_API_URL_PREFIX + '?testId=' + testId,
      systemConfigurationServerResponse.testDataByTestId21, {}, systemConfigurationServerApi.getTestDataById, [testId]
    );
  });

  it('should get artifact data by artifact id and group id', function () {
    var artifactId = 'wix-public-html-renderer-webapp';
    var groupId = 'com.wixpress';
    checkResponseFromServerHttp(
      serverApiUrl.ARTIFACT_DATA_API_URL_PREFIX + '?artifactId=' + artifactId + '?groupId=' + groupId,
      systemConfigurationServerResponse.artifactData, {}, systemConfigurationServerApi.getArtifactData, [artifactId, groupId]
    );
  });

  it('should get all templates', function () {
    checkResponseFromServerHttp(serverApiUrl.TEMPLATES_API_URL, systemConfigurationServerResponse.templates, [], systemConfigurationServerApi.getAllTemplates);
  });

  it('should get expression syntax', function () {
    checkResponseFromServerHttp(serverApiUrl.EXPRESSION_SYNTAX_API_URL, systemConfigurationServerResponse.expressionSyntax, [], systemConfigurationServerApi.getExpressionSyntax);
  });
});
