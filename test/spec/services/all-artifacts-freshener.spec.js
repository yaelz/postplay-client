'use strict';

describe('Service: allArtifactsFreshener', function () {

  var allArtifactsFreshener, scope, $q, deferred;
//  var failingArtifactsFromServer, passingArtifactsFromServer, allArtifactsFromServer, onePassingArtifact;
  var allArtifactsFromServer;
  beforeEach(function () {
    module('postplayTryAppInternal');
    //add your mocks here
    var basicTestInfoServerApiMock = {
      getAllArtifacts: jasmine.createSpy('getAllArtifacts').andCallFake(function () {
        deferred = $q.defer();
        deferred.resolve({data: allArtifactsFromServer});
        return deferred.promise;
      })
    };
    module({
      basicTestInfoServerApi: basicTestInfoServerApiMock
    });
  });

//  function initFailingAndPassingArray() {
//    passingArtifactsFromServer = [allArtifactsFromServer[0]];
//    failingArtifactsFromServer = allArtifactsFromServer.slice(1);
//    onePassingArtifact = passingArtifactsFromServer[0];
//  }
//  function mockServerFlush() {
//    scope.$apply();
//  }
  // Initialize the controller and a mock scope
  beforeEach(inject(function (_allArtifactsFreshener_, _basicTestInfoServerResponse_, $rootScope, _$q_) {
    allArtifactsFromServer  = _basicTestInfoServerResponse_.allArtifacts;
    allArtifactsFreshener = _allArtifactsFreshener_;
    scope = $rootScope;
    $q = _$q_;
  }));

//  describe('getting data from server', function () {
//    it('should hold the failing and passing arrays after getting data from server', function () {
//      initFailingAndPassingArray();
//      mockServerFlush();
//      expect(allArtifactsFreshener.passing).toEqual(passingArtifactsFromServer);
//    });
//  });
//  describe('updateChosenArtifactDataToAddToTable', function () {
//    it('should do nothing when getting an array with an empty string', function () {
//      allArtifactsFreshener.failing = failingArtifactsFromServer;
//      allArtifactsFreshener.updateChosenArtifact(['']);
//      expect(allArtifactsFreshener.failing).toEqual(failingArtifactsFromServer);
//    });
//    it('should remove the artifact from passing and add to failing', function () {
//      initFailingAndPassingArray();
//      passingArtifactsFromServer.forEach(function (passingArtifact) {
//        allArtifactsFreshener.passing.push(passingArtifact);
//      });
//      failingArtifactsFromServer.forEach(function (failingArtifact) {
//        allArtifactsFreshener.failing.push(failingArtifact);
//      });
//      failingArtifactsFromServer.unshift(onePassingArtifact);
//
//      allArtifactsFreshener.updateChosenArtifact([onePassingArtifact.artifactId, onePassingArtifact.groupId]);
//      expect(allArtifactsFreshener.failing).toEqual(failingArtifactsFromServer);
////      expect(allArtifactsFreshener.passing).toEqual([]);
//    });
//  });
});
