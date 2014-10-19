'use strict';

describe('Controller: BasicTestInfoController', function () {

  var allArtifacts, artifactVersions, versionSummary;
  var serverInfoMockSuccess, serverInfoMockWarning, serverInfoMockErrors, serverInfoMockIncomplete, $q, deferred;
  // load the controller's module
  beforeEach(function () {
    module('postplayTryAppInternal');
    serverInfoMockSuccess = {testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY'};
    serverInfoMockWarning = {testStatusEnum: 'STATUS_COMPLETED_WITH_WARNINGS'};
    serverInfoMockErrors = {testStatusEnum: 'STATUS_COMPLETED_WITH_ERRORS'};
    serverInfoMockIncomplete = {testStatusEnum: 'INCOMPLETE'};
    //add your mocks here
    var basicTestInfoServerApiMock = {
      getArtifactVersions: jasmine.createSpy('getArtifactVersions').andCallFake(function () {
        // TODO don't think it should check the server response... :\
        deferred = $q.defer();
        deferred.resolve({data: artifactVersions});
        return deferred.promise;
      }),
      getAllArtifacts: jasmine.createSpy('getAllArtifacts').andCallFake(function () {
        deferred = $q.defer();
        deferred.resolve({data: allArtifacts});
        return deferred.promise;
      }),
      getVersionSummary: jasmine.createSpy('getVersionSummary').andCallFake(function () {
        deferred = $q.defer();
        function clone(obj) {
          if (obj === null || typeof (obj) !== 'object') {
            return obj;
          }
          var temp = obj.constructor(); // changed
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              temp[key] = clone(obj[key]);
            }
          }
          return temp;
        }
        var a = clone(versionSummary);
        deferred.resolve(clone({data: a}));
        return deferred.promise;
      })
    };

    module({
      basicTestInfoServerApi: basicTestInfoServerApiMock
    });
  });

  var BasicTestInfoController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, basicTestInfoServerResponse, _$q_) {
    // TODO don't think it should check the server response... :\
    artifactVersions = basicTestInfoServerResponse.artifactVersions;
    allArtifacts = basicTestInfoServerResponse.allArtifacts;
    versionSummary = basicTestInfoServerResponse.versionSummary;
    $q = _$q_;

    scope = $rootScope.$new();
    BasicTestInfoController = $controller('BasicTestInfoController', {
      $scope: scope
    });
  }));

  describe('initialization and getting chosen artifact data', function () {
    function mockGettingDataFromServer() {
      scope.$apply();
    }
    it('should hold all artifacts information on initialization', function () {
      expect(BasicTestInfoController.basicTestInfoServerApi.getAllArtifacts).toHaveBeenCalled();
      mockGettingDataFromServer();
      expect(BasicTestInfoController.basicTestInfoServerApi.getArtifactVersions).toHaveBeenCalled();
      expect(BasicTestInfoController.basicTestInfoServerApi.getVersionSummary).toHaveBeenCalled();
      // TODO is this supposed to be checked? or only if the function has been called?
      expect(BasicTestInfoController.artifacts).toEqual(allArtifacts);
      expect(BasicTestInfoController.chosenVersionSummary).toEqual([]);
      expect(BasicTestInfoController.artifactsWereChosen).toEqual(false);
      expect(BasicTestInfoController.allVersionSummary).toEqual([versionSummary.responseBody[0], versionSummary.responseBody[0], versionSummary.responseBody[0]]);
    });

    it('should hold the chosen artifact data in the chosenVersionSummary table', function () {
      mockGettingDataFromServer();
      BasicTestInfoController.currentArtifactId = 'wix-public-html-renderer-webapp';
      BasicTestInfoController.updateChosenArtifactData();
      expect(BasicTestInfoController.chosenVersionSummary).toEqual([versionSummary.responseBody[0]]);
    });
  });

  describe('server run end status', function () {
    it('should notify whether a server run ended with an error', function () {
      expect(BasicTestInfoController.serverRunEndedWithError(serverInfoMockSuccess)).toBe(false);
      expect(BasicTestInfoController.serverRunEndedWithError(serverInfoMockWarning)).toBe(false);
      expect(BasicTestInfoController.serverRunEndedWithError(serverInfoMockErrors)).toBe(true);
      expect(BasicTestInfoController.serverRunEndedWithError(serverInfoMockIncomplete)).toBe(true);
    });

    it('should notify whether a server run ended with a warning', function () {
      expect(BasicTestInfoController.serverRunEndedWithWarning(serverInfoMockWarning)).toBe(true);
      expect(BasicTestInfoController.serverRunEndedWithWarning(serverInfoMockSuccess)).toBe(false);
      expect(BasicTestInfoController.serverRunEndedWithWarning(serverInfoMockErrors)).toBe(false);
      expect(BasicTestInfoController.serverRunEndedWithWarning(serverInfoMockIncomplete)).toBe(false);
    });

    it('should notify whether a server run ended successfully', function () {
      expect(BasicTestInfoController.serverRunEndedSuccessfully(serverInfoMockWarning)).toBe(false);
      expect(BasicTestInfoController.serverRunEndedSuccessfully(serverInfoMockSuccess)).toBe(true);
      expect(BasicTestInfoController.serverRunEndedSuccessfully(serverInfoMockErrors)).toBe(false);
      expect(BasicTestInfoController.serverRunEndedSuccessfully(serverInfoMockIncomplete)).toBe(false);
    });
  });
});
