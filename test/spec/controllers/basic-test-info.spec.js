'use strict';

describe('Controller: BasicTestInfoController', function () {

  var allArtifactsTwoServersFailed, artifactVersions, versionSummaryForRenderer, versionSummaryForRendererNewVersion, versionSummaryWrapperForRenderer, versionSummaryWrapperForRendererNewVersion, versionSummaryForWar, versionSummaryForEditor, versionSummaryWrapperForEditorChosen, versionSummaryWrapperForEditorNotChosen, versionSummaryWrapperBodyForWar, allArtifactsOneServerFailed, allArtifactsDifferentVersionForFailedServer;
  var mockServerFlush, spyFuncForGetAllArtifacts;
  var $q, deferred;
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
  // load the controller's module
  beforeEach(function () {
    module('postplayTryAppInternal');
    mockServerFlush = function () {
      scope.$apply();
    };
    spyFuncForGetAllArtifacts = function (allArtifacts) {
      return jasmine.createSpy('getAllArtifacts').andCallFake(function () {
        deferred = $q.defer();
        deferred.resolve({data: allArtifacts});
        return deferred.promise;
      });
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
        deferred.resolve({data: allArtifactsTwoServersFailed});
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
    allArtifactsTwoServersFailed = basicTestInfoServerResponse.allArtifacts;
    allArtifactsOneServerFailed = basicTestInfoServerResponse.allArtifactsNewNotFailed;
    allArtifactsDifferentVersionForFailedServer = basicTestInfoServerResponse.allArtifactsDifferentVersionForFailedServer;
    versionSummaryForEditor = basicTestInfoServerResponse.versionSummaryForEditor;
    versionSummaryForRenderer = basicTestInfoServerResponse.versionSummaryForRenderer;
    versionSummaryForRendererNewVersion = basicTestInfoServerResponse.versionSummaryForRendererNewVersion;
    versionSummaryForWar = basicTestInfoServerResponse.versionSummaryForWar;
    versionSummaryWrapperForEditorNotChosen = {artifactData: basicTestInfoServerResponse.versionSummaryForEditor.responseBody, isChosen: false, hasFailedServer: false};
    versionSummaryWrapperForEditorChosen = {artifactData: basicTestInfoServerResponse.versionSummaryForEditor.responseBody, isChosen: true, hasFailedServer: false};
    versionSummaryWrapperForRenderer = {artifactData: basicTestInfoServerResponse.versionSummaryForRenderer.responseBody, isChosen: false, hasFailedServer: true};
    versionSummaryWrapperForRendererNewVersion = {artifactData: basicTestInfoServerResponse.versionSummaryForRendererNewVersion.responseBody, isChosen: false, hasFailedServer: true};
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
      expect(BasicTestInfoController.artifacts).toEqual(allArtifactsTwoServersFailed);
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
    it('should not add an artifact that has failed in the last interval', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();
//      // TODO Change this to hold only failed from a list!
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
    })));
    it('should remove an artifact that has failed and now passed', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsOneServerFailed);
      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();
//      // TODO Change this to hold only failed from a list!
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer]);
    })));
    it('should remove a failed artifact if has a newer event or version, and add the newer one (in case it still fails)', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsDifferentVersionForFailedServer);
      basicTestInfoServerApi.getVersionSummary = jasmine.createSpy('getVersionSummary').andCallFake(function (artifactVersion, artifactId) {
        deferred = $q.defer();
        var newVersionSummary = clone(versionSummaryForRenderer);
        switch (artifactId) {
          case 'wix-public-html-renderer-webapp':
            newVersionSummary = clone(versionSummaryForRendererNewVersion);
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
      });
      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();
//      // TODO Change this to hold only failed from a list!
      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperBodyForWar, versionSummaryWrapperForRendererNewVersion]);
    })));
  });
});
