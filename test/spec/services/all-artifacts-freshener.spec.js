'use strict';

describe('Service: allArtifactsFreshener', function () {

  // load the service's module
  var $q, scope, deferred, allArtifactsFromServer, allArtifactsFreshener;
  var failedArtifactsFromServerArray, unFailedArtifactsFromServerArray, unfailedArtifactsWrappedArray, failedArtifactsWrappedArray, artifactWrapper0, artifactWrapper1;
  function initializeArtifactArrayANDFailedAndChosenArray() {
    artifactWrapper0 = {artifactData: allArtifactsFromServer[0], isChosen: false, status: '*'};
    artifactWrapper1 = {artifactData: allArtifactsFromServer[1], isChosen: false, status: '*'};
    var artifactWrapper2 = {artifactData: allArtifactsFromServer[2], isChosen: false, status: '*'};
    var artifactWrapper3 = {artifactData: allArtifactsFromServer[3], isChosen: false, status: '*'};
    var artifactWrapper4 = {artifactData: allArtifactsFromServer[4], isChosen: false, status: '*'};
    var artifactWrapper5 = {artifactData: allArtifactsFromServer[5], isChosen: false, status: '*'};
    var artifactWrapper6 = {artifactData: allArtifactsFromServer[6], isChosen: false, status: '*'};
    unFailedArtifactsFromServerArray = [allArtifactsFromServer[0]];
    failedArtifactsFromServerArray = allArtifactsFromServer.slice(1);
    unfailedArtifactsWrappedArray = [artifactWrapper0];
    failedArtifactsWrappedArray = [artifactWrapper1, artifactWrapper2, artifactWrapper3, artifactWrapper4, artifactWrapper5, artifactWrapper6];
  }
  function mockServerFlush() {
    scope.$apply();
  }
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
    var artifactsTablesEntityMock = {
      addToPassedArtifactsTable: jasmine.createSpy('addToPassedArtifactsTable'),
      addToFailedAndChosenTable: jasmine.createSpy('addToFailedAndChosenTable'),
      removeFromPassedArtifactsTableByArtifactId: jasmine.createSpy('removeFromPassedArtifactsTableByArtifactId'),
      addToBeginningOfFailedAndChosenArtifactsTable: jasmine.createSpy('addToBeginningOfFailedAndChosenArtifactsTable')
    };
    var postPlayUtilsMock = {
      statusIsFailedOrWarning: jasmine.createSpy('statusIsFailedOrWarning'),
      getArtifactStatus: jasmine.createSpy('getArtifactStatus').andCallFake(function () {
        return '*';
      }),
      getFailedAndNotFailedArtifactsObject: jasmine.createSpy('getArtifactStatus').andCallFake(function () {
        return {passedArtifacts: unFailedArtifactsFromServerArray, failedArtifacts: failedArtifactsFromServerArray};
      })
    };

    module({
      basicTestInfoServerApi: basicTestInfoServerApiMock,
      artifactsTablesEntity: artifactsTablesEntityMock,
      postPlayUtils: postPlayUtilsMock
    });
  });

  // Initialize the controller and a mock scope
  beforeEach(inject(function (basicTestInfoServerResponse, _$q_) {
    $q = _$q_;
    allArtifactsFromServer  = basicTestInfoServerResponse.allArtifacts;
  }));

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_allArtifactsFreshener_, $rootScope) {
    allArtifactsFreshener = _allArtifactsFreshener_;
    scope = $rootScope.$new();
    initializeArtifactArrayANDFailedAndChosenArray();
  }));

  describe('on initialization', function () {
    it('should hold postPlayUtils', function () {
      expect(allArtifactsFreshener.postPlayUtils).toBeDefined();
    });
    it('should hold basicTestInfoServerApi', function () {
      expect(allArtifactsFreshener.basicTestInfoServerApi).toBeDefined();
    });
    it('should hold artifactsTablesEntity', function () {
      expect(allArtifactsFreshener.artifactsTablesEntity).toBeDefined();
    });
    it('should call getAllArtifacts on initialization', function () {
      expect(allArtifactsFreshener.basicTestInfoServerApi.getAllArtifacts).toHaveBeenCalled();
    });
    it('should call addToFailedAndChosenTable only with failed artifacts', function () {
      mockServerFlush();
      expect(allArtifactsFreshener.artifactsTablesEntity.addToFailedAndChosenTable.calls.length).toBe(failedArtifactsFromServerArray.length);
      failedArtifactsWrappedArray.forEach(function (failedArtifact) {
        expect(allArtifactsFreshener.artifactsTablesEntity.addToFailedAndChosenTable).toHaveBeenCalledWith(failedArtifact);
      });
    });
    it('should call addToPassedArtifactsTable only with non-failed artifacts', function () {
      mockServerFlush();
      expect(allArtifactsFreshener.artifactsTablesEntity.addToPassedArtifactsTable.calls.length).toBe(unFailedArtifactsFromServerArray.length);
      unfailedArtifactsWrappedArray.forEach(function (passedArtifact) {
        expect(allArtifactsFreshener.artifactsTablesEntity.addToPassedArtifactsTable).toHaveBeenCalledWith(passedArtifact);
      });
    });
  });
  describe('updateChosenArtifactDataToAddToTable', function () {
    it('should remove the artifact from passedArtifacts table and add to failedAndChosenArtifacts table', function () {
      mockServerFlush();
      allArtifactsFreshener.updateChosenArtifactDataToAddToTable(unFailedArtifactsFromServerArray[0].artifactId);
      expect(allArtifactsFreshener.artifactsTablesEntity.removeFromPassedArtifactsTableByArtifactId).toHaveBeenCalledWith(unFailedArtifactsFromServerArray[0].artifactId);
      expect(allArtifactsFreshener.artifactsTablesEntity.addToBeginningOfFailedAndChosenArtifactsTable).toHaveBeenCalled();
      // TODO next line won't work because the remove function above is a mock...
//        expect(allArtifactsFreshener.artifactsTablesEntity.addToBeginningOfFailedAndChosenArtifactsTable).toHaveBeenCalledWith(unFailedArtifactsFromServerArray[0]);
    });
  });
  describe('when getting data from the server on refresh', function () {
    it('', function () {
      
    });
  });
});
