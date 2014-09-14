'use strict';

describe('Controller: CurrentlyRunningArtifactsController', function () {

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

  var CurrentlyRunningArtifactsController, scope, currentlyRunningArtifacts;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, basicTestInfoServerResponse) {
    currentlyRunningArtifacts = basicTestInfoServerResponse.currentlyRunningArtifacts;
    scope = $rootScope.$new();
    CurrentlyRunningArtifactsController = $controller('CurrentlyRunningArtifactsController', {
      $scope: scope
    });
  }));

  it('should hold the currently running artifacts', function () {
    //TODO should I be checking this?
    expect(CurrentlyRunningArtifactsController.basicTestInfoServerApi.getCurrentlyRunningArtifacts).toHaveBeenCalled();
    expect(CurrentlyRunningArtifactsController.currentlyRunningArtifacts).toEqual(currentlyRunningArtifacts);
  });
});
