'use strict';

describe('Service: allArtifactsFreshener', function () {

  // load the service's module
  var $q, deferred, allArtifactsFromServer, allArtifactsFreshener;
  beforeEach(function () {
    module('postplayTryAppInternal');
    //add your mocks here
//    console.log(1);
    var basicTestInfoServerApiMock = {
      getAllArtifacts: jasmine.createSpy('getAllArtifacts')
//      getAllArtifacts: jasmine.createSpy('getAllArtifacts').andCallFake(function () {
//        console.log(3);
//        deferred = $q.defer();
//        deferred.resolve({data: allArtifactsTwoServersFailed});
//        return deferred.promise;
//      })
    };

    module({
      basicTestInfoServerApi: basicTestInfoServerApiMock
    });
  });

  // Initialize the controller and a mock scope
  beforeEach(inject(function (basicTestInfoServerResponse, _allArtifactsFreshener_, _$q_) {
//    console.log(2);
    $q = _$q_;
    allArtifactsFreshener = _allArtifactsFreshener_;
    allArtifactsFromServer  = basicTestInfoServerResponse.allArtifacts;
  }));

  it('should call getAllArtifacts from the service', function () {
//    console.log('*****************' + $q);

    expect(allArtifactsFreshener.basicTestInfoServerApi.getAllArtifacts).toHaveBeenCalled();
  });
//  it('should call isNewArtifact', function () {
//    expect(allArtifactsFreshener.allArtifactsTablesRuler.isNewArtifact).toHaveBeenCalled();
//  });
//  it('should call the add to all artifacts method when getting a new artifact', function () {
  // mock the tables' entity with two empty tables
  // mock the getAllArtifacts with some artifact array
  // make sure that the add to all artifacts method is called (call should be made inside the refreshAllArtifacts method)
//  });

});
