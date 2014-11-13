'use strict';

describe('Service: allArtifactsFreshener', function () {

  var allArtifactsFreshener, scope, $q, deferred;
//  var failingArtifactsFromServer, passingArtifactsFromServer, allArtifactsFromServer, onePassingArtifact;
  var allArtifactsFromServer, spyFuncForGetAllArtifacts, basicTestInfoServerApi;
  beforeEach(function () {
    module('postplayTryAppInternal');
    //add your mocks here
    spyFuncForGetAllArtifacts = function (artifacts) {
      return jasmine.createSpy('getAllArtifacts').andCallFake(function () {
        deferred = $q.defer();
        deferred.resolve({data: artifacts});
        return deferred.promise;
      });
    };
    var basicTestInfoServerApiMock = {
      getAllArtifacts: {}
    };
    module({
      basicTestInfoServerApi: basicTestInfoServerApiMock
    });
  });

  function aFailedArtifact() {
    return {analysisResultEnum: 'TEST_FAILED'};
  }

  function aPassedArtifact() {
    return {testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED'};
  }

  function mockServerFlush() {
    scope.$apply();
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_allArtifactsFreshener_, _basicTestInfoServerResponse_, $rootScope, _$q_, _basicTestInfoServerApi_) {
    allArtifactsFromServer = _basicTestInfoServerResponse_.allArtifacts;
    allArtifactsFreshener = _allArtifactsFreshener_;
    basicTestInfoServerApi = _basicTestInfoServerApi_;
    scope = $rootScope;
    $q = _$q_;
  }));

  function assumingServerHasArtifacts(artifacts) {
    basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(artifacts);
    allArtifactsFreshener.getAllArtifacts(function () {});
    mockServerFlush();
  }
  describe('getting data from server', function () {
    it('should hold the failedAndChosen and passed arrays', function () {
      var passed = aPassedArtifact();
      var failed = aFailedArtifact();
      assumingServerHasArtifacts([failed, passed]);
      expect(allArtifactsFreshener.failedAndPassing).toEqual({passing: [passed], failing: [failed]});
    });
    // TODO another test to add the status
  });
  describe('updateChosenArtifactDataToAddToTable', function () {
    it('should do nothing when getting an empty string', function () {
      var passed = aPassedArtifact();
      var failed = aFailedArtifact();
      assumingServerHasArtifacts([failed, passed]);

      allArtifactsFreshener.getAllArtifacts(function () {});
      expect(allArtifactsFreshener.failedAndPassing).toEqual({passing: [passed], failing: [failed]});
    });
    it('should take an artifact from the passing and move it to the failedAndChosen array', function () {
      var passedArtifactId = 'passed_1';

      var passed = aPassedArtifact();
      passed.artifactId = passedArtifactId;
      var failed = aFailedArtifact();

      assumingServerHasArtifacts([failed, passed]);
      allArtifactsFreshener.getAllArtifacts(function () {}, passedArtifactId);
      expect(allArtifactsFreshener.failedAndPassing).toEqual({passing: [], failing: [passed, failed]});
    });
  });
});
