'use strict';

describe('Service: dashboardServerApi', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var dashboardServerApi, $httpBackend, dashboardServerResponse, serverApiUrl;
  beforeEach(inject(function (_dashboardServerApi_, _$httpBackend_, _dashboardServerResponse_, _serverApiUrl_) {
    dashboardServerApi = _dashboardServerApi_;
    serverApiUrl = _serverApiUrl_;
    $httpBackend = _$httpBackend_;
    dashboardServerResponse = _dashboardServerResponse_;
  }));

  function checkResponseFromServerHttp(API_URL, serverResponse, valueBeforeServerResponse, dashboardFuncToApply) {
    // TODO same function in all server apis! Refactor?
    $httpBackend.expectGET(API_URL).respond(200, serverResponse);
    var functionReturnValue = dashboardFuncToApply();
    expect(functionReturnValue).toEqual(valueBeforeServerResponse);
    $httpBackend.flush();
    expect(functionReturnValue).toEqual(serverResponse);
    return functionReturnValue;
  }

  it('should get all currently running tests', function () {
    // TODO what does the responseBody look like?
    var functionReturnValue = checkResponseFromServerHttp(serverApiUrl.CURRENTLY_RUNNING_TESTS_API_URL, dashboardServerResponse.currentlyRunningTests, {}, dashboardServerApi.getCurrentlyRunningTests);
    expect(functionReturnValue).toEqual(dashboardServerResponse.currentlyRunningTests);
  });

  it('should get the field map data', function () {
    var functionReturnValue = checkResponseFromServerHttp(serverApiUrl.FIELD_MAP_API_URL, dashboardServerResponse.fieldMap, {}, dashboardServerApi.getFieldMap);
    expect(functionReturnValue).toEqual(dashboardServerResponse.fieldMap);
  });
});
