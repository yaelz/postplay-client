'use strict';

describe('Controller: BasicTestInfoController', function () {

  var allArtifactsTwoServersFailed, artifactVersions, versionSummaryForRenderer, versionSummaryForRendererNewVersion, versionSummaryWrapperForRenderer, versionSummaryWrapperForRendererNewVersion, versionSummaryForWar, versionSummaryForEditor, versionSummaryWrapperForEditorChosen, versionSummaryWrapperForEditorNotChosen, versionSummaryWrapperBodyForWar, allArtifactsOneServerFailed, allArtifactsDifferentVersionForFailedServer;
  var mockServerFlush, spyFuncForGetAllArtifacts;
  var $q, $httpBackend, deferred;
  var allArtifactArray, failedArtifactArray;
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
  beforeEach(inject(function ($controller, $rootScope, basicTestInfoServerResponse, _$q_, _$httpBackend_) {
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
    $httpBackend = _$httpBackend_;

    scope = $rootScope.$new();
    BasicTestInfoController = $controller('BasicTestInfoController', {
      $scope: scope
    });
  }));

  describe('initialization and getting artifact data from server', function () {
    beforeEach(function () {
      var artifactWrapper0 = {artifactData: allArtifactsTwoServersFailed[0], isChosen: false, status: 'PASSED'};
      var artifactWrapper1 = {artifactData: allArtifactsTwoServersFailed[1], isChosen: false, status: 'FAILED'};
      var artifactWrapper2 = {artifactData: allArtifactsTwoServersFailed[2], isChosen: false, status: 'WARNING'};
      var artifactWrapper3 = {artifactData: allArtifactsTwoServersFailed[3], isChosen: false, status: 'WARNING'};
      var artifactWrapper4 = {artifactData: allArtifactsTwoServersFailed[4], isChosen: false, status: 'FAILED'};
      var artifactWrapper5 = {artifactData: allArtifactsTwoServersFailed[5], isChosen: false, status: 'WARNING'};
      var artifactWrapper6 = {artifactData: allArtifactsTwoServersFailed[6], isChosen: false, status: 'WARNING'};
      allArtifactArray = [artifactWrapper0, artifactWrapper1, artifactWrapper2, artifactWrapper3, artifactWrapper4, artifactWrapper5, artifactWrapper6];
      failedArtifactArray = [artifactWrapper1, artifactWrapper2, artifactWrapper3, artifactWrapper4, artifactWrapper5, artifactWrapper6];
    });
    it('should hold all artifacts\' information on initialization', function () {
      expect(BasicTestInfoController.basicTestInfoServerApi.getAllArtifacts).toHaveBeenCalled();
      mockServerFlush();
      // TODO is this supposed to be checked? or only if the function has been called?
      expect(BasicTestInfoController.allArtifactWrappers).toEqual(allArtifactArray);
    });
    it('should only hold the error/warning artifacts\' data in the failedAndChosenArtifacts table', function () {
      mockServerFlush();
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(failedArtifactArray);
    });
    it('should add a chosen artifact to the failedAndChosenArtifactsSummary table, and change its isChosen field in the allVersionSummary to true', function () {
      mockServerFlush();
      BasicTestInfoController.currentArtifactToAddToTable = 'wix-html-editor-webapp';
      expect(BasicTestInfoController.currentArtifactToAddToTable).toEqual('wix-html-editor-webapp');
      BasicTestInfoController.updateChosenArtifactDataToAddToTable();
      allArtifactArray[0].isChosen = true;
      expect(BasicTestInfoController.currentArtifactToAddToTable).toEqual('');
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(allArtifactArray);
    });
    it('should not add a chosen artifact if it\'s already chosen', function () {
      mockServerFlush();
      BasicTestInfoController.currentArtifactToAddToTable = 'wix-html-editor-webapp';
      BasicTestInfoController.updateChosenArtifactDataToAddToTable();
      allArtifactArray[0].isChosen = true;
      BasicTestInfoController.currentArtifactToAddToTable = 'wix-html-editor-webapp';
      BasicTestInfoController.updateChosenArtifactDataToAddToTable();
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(allArtifactArray);
    });
//    it('should not add a chosen artifact if it\'s a failed artifact', function () {
//      mockServerFlush();
//      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
//      BasicTestInfoController.currentArtifactId = 'wix-public-html-renderer-webapp';
//      BasicTestInfoController.updateChosenArtifactData();
//      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
//    });
  });

//  describe('getting different info from server on refresh', function () {
//    it('should not add an artifact that has failed in the last interval', (inject(function (basicTestInfoServerApi, $interval) {
//      mockServerFlush();
//      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
//      $interval.flush(BasicTestInfoController.REFRESH_TIME);
//      mockServerFlush();
////      // TODO Change this to hold only failed from a list!
//      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
//    })));
//    it('should remove an artifact that has failed and now passed', (inject(function (basicTestInfoServerApi, $interval) {
//      mockServerFlush();
//      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
//      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsOneServerFailed);
//      $interval.flush(BasicTestInfoController.REFRESH_TIME);
//      mockServerFlush();
////      // TODO Change this to hold only failed from a list!
//      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer]);
//    })));
//    it('should remove a failed artifact if has a newer event or version, and add the newer one (in case it still fails)', (inject(function (basicTestInfoServerApi, $interval) {
//      mockServerFlush();
//      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperForRenderer, versionSummaryWrapperBodyForWar]);
//      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsDifferentVersionForFailedServer);
//      basicTestInfoServerApi.getVersionSummary = jasmine.createSpy('getVersionSummary').andCallFake(function (artifactVersion, artifactId) {
//        deferred = $q.defer();
//        var newVersionSummary = clone(versionSummaryForRenderer);
//        switch (artifactId) {
//          case 'wix-public-html-renderer-webapp':
//            newVersionSummary = clone(versionSummaryForRendererNewVersion);
//            break;
//          case 'wix-html-editor-webapp':
//            newVersionSummary = clone(versionSummaryForEditor);
//            break;
//          case 'wix-public-war':
//            newVersionSummary = clone(versionSummaryForWar);
//            break;
//          default:
//            newVersionSummary = clone(versionSummaryForRenderer);
//        }
//        deferred.resolve(clone({data: newVersionSummary}));
//        return deferred.promise;
//      });
//      $interval.flush(BasicTestInfoController.REFRESH_TIME);
//      mockServerFlush();
////      // TODO Change this to hold only failed from a list!
//      expect(BasicTestInfoController.failedAndChosenArtifactsSummary).toEqual([versionSummaryWrapperBodyForWar, versionSummaryWrapperForRendererNewVersion]);
//    })));
//  });
});
