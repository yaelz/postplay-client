'use strict';

describe('Service: allArtifactsFreshener', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
    var basicTestInfoServerApiMock = {
      getAllArtifacts: jasmine.createSpy('getAllArtifacts')
    };
    module({
      basicTestInfoServerApi: basicTestInfoServerApiMock
    });
  });

  // instantiate service
  var allArtifactsFreshener;
  beforeEach(inject(function (_allArtifactsFreshener_) {
    allArtifactsFreshener = _allArtifactsFreshener_;
  }));

  it('should call getAllArtifacts from the service', function () {
    expect(allArtifactsFreshener.basicTestInfoServerApi.getAllArtifacts).toHaveBeenCalled();
  });

});
