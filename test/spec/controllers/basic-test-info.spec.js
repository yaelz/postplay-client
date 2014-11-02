'use strict';

describe('Controller: BasicTestInfoController', function () {

  var allArtifacts, artifactVersions, versionSummaryForRenderer, versionSummaryWrapperForRenderer, versionSummaryForWar, versionSummaryForEditor, versionSummaryWrapperForEditorChosen, versionSummaryWrapperForEditorNotChosen, versionSummaryWrapperBodyForWar;
  var mockServerFlush;
  var serverInfoMockSuccess, serverInfoMockWarning, serverInfoMockErrors, serverInfoMockIncomplete, $q, deferred;
  // load the controller's module
  beforeEach(function () {
    module('postplayTryAppInternal');
    // TODO where should this function go?
    function clone(obj) {
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }
      var newObj = obj.constructor(); // changed
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = clone(obj[key]);
        }
      }
      return newObj;
    }
    mockServerFlush = function () {
      scope.$apply();
    };
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
      getVersionSummary: jasmine.createSpy('getVersionSummary').andCallFake(function (artifactVersion, artifactId) {
        deferred = $q.defer();
        var newVersionSummary = clone(versionSummaryForRenderer);
        switch (artifactId) {
          case 'wix-public-html-renderer-webapp':
            newVersionSummary = clone(versionSummaryForRenderer);
            break;
          case 'wix-html-editor-webapp':
            newVersionSummary = clone(versionSummaryForEditor);
            break;
          case 'wix-public-war':
            newVersionSummary = clone(versionSummaryForWar);
            break;
          default:
            newVersionSummary = clone(versionSummaryForRenderer);
        }
        deferred.resolve(clone({data: newVersionSummary}));
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
    versionSummaryForEditor = basicTestInfoServerResponse.versionSummaryForEditor;
    versionSummaryForRenderer = basicTestInfoServerResponse.versionSummaryForRenderer;
    versionSummaryForWar = basicTestInfoServerResponse.versionSummaryForWar;
    versionSummaryWrapperForEditorNotChosen = {artifactData: basicTestInfoServerResponse.versionSummaryForEditor.responseBody, isChosen: false, hasFailedServer: false};
    versionSummaryWrapperForEditorChosen = {artifactData: basicTestInfoServerResponse.versionSummaryForEditor.responseBody, isChosen: true, hasFailedServer: false};
    versionSummaryWrapperForRenderer = {artifactData: basicTestInfoServerResponse.versionSummaryForRenderer.responseBody, isChosen: false, hasFailedServer: true};
    versionSummaryWrapperBodyForWar = {artifactData: basicTestInfoServerResponse.versionSummaryForWar.responseBody, isChosen: false, hasFailedServer: true};
    $q = _$q_;

    scope = $rootScope.$new();
    BasicTestInfoController = $controller('BasicTestInfoController', {
      $scope: scope
    });
  }));

  describe('initialization and getting artifact data from server', function () {
    it('should hold all artifacts\' information on initialization', function () {
      expect(BasicTestInfoController.basicTestInfoServerApi.getAllArtifacts).toHaveBeenCalled();
      mockServerFlush();
      expect(BasicTestInfoController.basicTestInfoServerApi.getVersionSummary).toHaveBeenCalled();
      // TODO is this supposed to be checked? or only if the function has been called?
      expect(BasicTestInfoController.artifacts).toEqual(allArtifacts);
      expect(BasicTestInfoController.allVersionSummary).toEqual([versionSummaryWrapperForEditorNotChosen, versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
    });
//
    it('should hold the error artifacts\' data in the failedAndChosenArtifactsSummary table', function () {
      mockServerFlush();
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
    });
    it('should add a chosen artifact to the failedAndChosenArtifactsSummary table, and change its isChosen field in the allVersionSummary to true', function () {
      mockServerFlush();
      expect(BasicTestInfoController.allVersionSummary).toEqual([versionSummaryWrapperForEditorNotChosen, versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
      BasicTestInfoController.currentArtifactId = 'wix-html-editor-webapp';
      BasicTestInfoController.updateChosenArtifactData();
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForEditorChosen, versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
      expect(BasicTestInfoController.allVersionSummary).toEqual([versionSummaryWrapperForEditorChosen, versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
    });
    it('should not add a chosen artifact if it\'s already chosen', function () {
      mockServerFlush();
      BasicTestInfoController.currentArtifactId = 'wix-html-editor-webapp';
      BasicTestInfoController.updateChosenArtifactData();
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForEditorChosen, versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
      BasicTestInfoController.updateChosenArtifactData();
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForEditorChosen, versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
    });
    it('should not add a chosen artifact if it\'s a failed artifact', function () {
      mockServerFlush();
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
      BasicTestInfoController.currentArtifactId = 'wix-public-html-renderer-webapp';
      BasicTestInfoController.updateChosenArtifactData();
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
    });
  });

  describe('getting different info from server on refresh', function () {
//    it('should make one of the artifacts that failed - pass', (inject(function (basicTestInfoServerApi, $interval) {
//      mockServerFlush();
//      // TODO Change this to hold only failed from a list!
//      expect(BasicTestInfoController.failedVersionSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
//      basicTestInfoServerApi.getAllFailedArtifacts = spyFuncForGetAllFailedArtifacts(allFailedArtifactsOnSecondServerCall);
//      $interval.flush(BasicTestInfoController.REFRESH_TIME);
//      mockServerFlush();
//      // TODO Change this to hold only failed from a list!
//      expect(BasicTestInfoController.failedVersionSummary).toEqual([versionSummaryWrapperForRenderer]);
//    })));
  });

  describe('server run end status', function () {
    beforeEach(function () {
      serverInfoMockSuccess = {testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY'};
      serverInfoMockWarning = {testStatusEnum: 'STATUS_COMPLETED_WITH_WARNINGS'};
      serverInfoMockErrors = {testStatusEnum: 'STATUS_COMPLETED_WITH_ERRORS'};
      serverInfoMockIncomplete = {testStatusEnum: 'INCOMPLETE'};
    });
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
