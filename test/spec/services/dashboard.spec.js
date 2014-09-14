'use strict';

describe('Service: dashboard', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var dashboard, $httpBackend, dashboardServerResponse;
  beforeEach(inject(function (_dashboard_, _$httpBackend_, _dashboardServerResponse_) {
    dashboard = _dashboard_;
    $httpBackend = _$httpBackend_;
    dashboardServerResponse = _dashboardServerResponse_;
  }));

  function checkResponseFromServerHttp(API_URL, serverResponse, valueBeforeServerResponse, dashboardFuncToApply) {
    $httpBackend.expectGET(API_URL).respond(200, serverResponse);
    var functionReturnValue = dashboardFuncToApply();
    expect(functionReturnValue).toEqual(valueBeforeServerResponse);
    $httpBackend.flush();
    expect(functionReturnValue).toEqual(serverResponse);
    return functionReturnValue;
  }

  it('should get all currently running tests', function () {
    // TODO what does the responseBody look like?
    var functionReturnValue = checkResponseFromServerHttp('/_api/getCurrentlyRunningTests/json', dashboardServerResponse.currentlyRunningTests, {}, dashboard.getCurrentlyRunningTests);
    expect(functionReturnValue).toEqual(dashboardServerResponse.currentlyRunningTests);
  });

  it('should get the field map data', function () {
    var functionReturnValue = checkResponseFromServerHttp('/_api/fieldMap', dashboardServerResponse.fieldMap, {}, dashboard.getFieldMap);
    expect(functionReturnValue).toEqual(dashboardServerResponse.fieldMap);
  });
});
