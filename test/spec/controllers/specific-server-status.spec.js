'use strict';

describe('Controller: SpecificServerStatusController', function () {

  // load the controller's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
    module({
      serverStatusCtrlDTO: {}
    });
  });

  var SpecificServerStatusController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SpecificServerStatusController = $controller('SpecificServerStatusController', {
      $scope: scope
    });
  }));

  it('Should hold a specific-server-status-server-api service', function () {
    expect(SpecificServerStatusController.specificServerStatusServerApi).toBeDefined();
    expect(SpecificServerStatusController.specificServerStatusServerApi.constructor.name).toEqual('SpecificServerStatusServerApi');
  });

});
