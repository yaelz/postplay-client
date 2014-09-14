'use strict';

describe('Controller: CurrentlyRunningController', function () {

  // load the controller's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
    var basicTestInfoServerApiMock = {
      getCurrentlyRunningArtifacts: jasmine.createSpy('getVersionSummary').andCallFake(function () {
        return currentlyRunningArtifacts;
      })
    };

    module({
      basicTestInfoServerApi: basicTestInfoServerApiMock
    });
  });

  var CurrentlyRunningController, scope, currentlyRunningArtifacts;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, basicTestInfoServerResponse) {
    currentlyRunningArtifacts = basicTestInfoServerResponse.currentlyRunningArtifacts;
    scope = $rootScope.$new();
    CurrentlyRunningController = $controller('CurrentlyRunningController', {
      $scope: scope
    });
  }));

  it('should hold the currently running artifacts', function () {
    expect(CurrentlyRunningController.currentlyRunningArtifacts).toEqual(currentlyRunningArtifacts);
    expect(CurrentlyRunningController.basicTestInfoServerApi.getCurrentlyRunningArtifacts).toHaveBeenCalled();
  });
});
