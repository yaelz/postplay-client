'use strict';

describe('Controller: TestResultsController', function () {

  // load the controller's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  var TestResultsController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TestResultsController = $controller('TestResultsController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the controller', function () {
    expect(TestResultsController.awesomeThings.length).toBe(6);
  });
});
