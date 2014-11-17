'use strict';

describe('Service: allArtifactsFreshener', function () {

  var allArtifactsFreshener, postPlayUtils, scope, $q, deferred;
  var spyFuncForGetAllArtifacts, spyFuncForVersionSummary, allArtifactsApi;
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
    spyFuncForVersionSummary = function (summary) {
      return jasmine.createSpy('getVersionSummary').andCallFake(function () {
        deferred = $q.defer();
        deferred.resolve({data: summary});
        return deferred.promise;
      });
    };
    var allArtifactsApiMock = {
      getAllArtifacts: {}
    };
    module({
      allArtifactsApi: allArtifactsApiMock
    });
  });

  function aFailedArtifact() {
    return {analysisResultEnum: 'TEST_FAILED'};
  }

  function aPassedArtifact() {
    return {testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED'};
  }

  function aVersionSummary() {
    return [
      {
        artifactId: 'wix-html-editor-webapp',
        server: 'app18.aus.wixpress.com'
      }
    ];
  }

  function resolvePromise() {
    scope.$apply();
  }

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_allArtifactsFreshener_, _basicTestInfoServerResponse_, _postPlayUtils_, $rootScope, _$q_, _allArtifactsApi_) {
    allArtifactsFreshener = _allArtifactsFreshener_;
    allArtifactsApi = _allArtifactsApi_;
    postPlayUtils = _postPlayUtils_;
    scope = $rootScope;
    $q = _$q_;
  }));

  function assumingServerHasArtifacts(artifacts) {
    allArtifactsApi.getAllArtifacts = spyFuncForGetAllArtifacts(artifacts);
    resolvePromise();
  }

  function assumingServerReturnedVersionSummary(versionSum) {
    allArtifactsApi.getVersionSummary = spyFuncForVersionSummary(versionSum);
    resolvePromise();
  }
  function assumingArtifactsHaveBeenInitializedWith(artifacts) {
    assumingServerHasArtifacts(artifacts);
    allArtifactsFreshener.getAllArtifacts();
    resolvePromise();
  }

  function addStatusToArtifact(artifact) {
    var newArtifact = _.clone(artifact);
    var status = postPlayUtils.getArtifactStatus(newArtifact);
    newArtifact.status = status;
    return newArtifact;
  }
  describe('getting all artifacts\' data from server', function () {
    it('should hold the failedAndChosen and passed arrays', function () {
      var passed = aPassedArtifact();
      var failed = aFailedArtifact();

      assumingServerHasArtifacts([failed, passed]);
      var failedWithStatus = addStatusToArtifact(failed);
      var passedWithStatus = addStatusToArtifact(passed);
      var artifactsAfterProcessing;
      allArtifactsFreshener.getAllArtifacts().then(function (failedAndPassing) {
        artifactsAfterProcessing = failedAndPassing;
      });
      resolvePromise();
      expect(artifactsAfterProcessing).toEqual({passing: [passedWithStatus], failing: [failedWithStatus]});
    });
  });
  describe('updateChosenArtifactDataToAddToTable', function () {
    it('should do nothing when getting an empty string', function () {
      var passed = aPassedArtifact();
      var failed = aFailedArtifact();

      assumingArtifactsHaveBeenInitializedWith([failed, passed]);
      //TODO is it ok that the original object gets the status property straight on it? and it's
      // not seen in this test (it is seen in the failed and chosen array test)
      expect(allArtifactsFreshener.updateChosenArtifact('')).toEqual({passing: [passed], failing: [failed]});
    });
    it('should take an artifact from the passing and move it to the failedAndChosen array', function () {
      var passedArtifactId = 'passed_1';

      var passed = aPassedArtifact();
      passed.artifactId = passedArtifactId;
      var failed = aFailedArtifact();

      assumingArtifactsHaveBeenInitializedWith([failed, passed]);
      allArtifactsFreshener.updateChosenArtifact(passedArtifactId);
      expect(allArtifactsFreshener.failedAndPassing).toEqual({passing: [], failing: [passed, failed]});
    });
  });

  describe('getVersionSummary', function () {
    it('should get version summary', function () {
      var versionSum = aVersionSummary();
      var failedArtifact = aFailedArtifact();

      assumingServerReturnedVersionSummary(versionSum);

      var versionSumFromServer;
      allArtifactsFreshener.getVersionSummary(failedArtifact).then(function (response) {
        versionSumFromServer = response;
      });
      resolvePromise();
      expect(versionSumFromServer).toEqual(versionSum);

    });
  });
});
