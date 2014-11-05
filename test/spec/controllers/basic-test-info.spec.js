'use strict';

describe('Controller: BasicTestInfoController', function () {

  var allArtifactsTwoServersFailed, artifactVersions, versionSummaryForRendererNewVersion, versionSummaryWrapperForRendererNewVersion, versionSummaryForWar, versionSummaryForEditor, versionSummaryWrapperForEditorChosen, versionSummaryWrapperForEditorNotChosen, versionSummaryWrapperBodyForWar, allArtifactsDifferentVersionForFailedServer;
  var mockServerFlush, spyFuncForGetAllArtifacts;
  var $q, $httpBackend, deferred;
  var BasicTestInfoController, scope;
  var allArtifactsWrappedArray, failedArtifactWrappedArray, artifactWrapper0, artifactWrapper1;
  function initializeArtifactArrayANDFailedAndChosenArray() {
    artifactWrapper0 = {artifactData: allArtifactsTwoServersFailed[0], isChosen: false, status: 'PASSED'};
    artifactWrapper1 = {artifactData: allArtifactsTwoServersFailed[1], isChosen: false, status: 'FAILED'};
    var artifactWrapper2 = {artifactData: allArtifactsTwoServersFailed[2], isChosen: false, status: 'WARNING'};
    var artifactWrapper3 = {artifactData: allArtifactsTwoServersFailed[3], isChosen: false, status: 'WARNING'};
    var artifactWrapper4 = {artifactData: allArtifactsTwoServersFailed[4], isChosen: false, status: 'FAILED'};
    var artifactWrapper5 = {artifactData: allArtifactsTwoServersFailed[5], isChosen: false, status: 'WARNING'};
    var artifactWrapper6 = {artifactData: allArtifactsTwoServersFailed[6], isChosen: false, status: 'WARNING'};
    allArtifactsWrappedArray = [artifactWrapper0, artifactWrapper1, artifactWrapper2, artifactWrapper3, artifactWrapper4, artifactWrapper5, artifactWrapper6];
    failedArtifactWrappedArray = [artifactWrapper1, artifactWrapper2, artifactWrapper3, artifactWrapper4, artifactWrapper5, artifactWrapper6];
  }
  function filterObjectFromTable(table, oldToRemove) {
    return table.filter(function (currObjInTable) {
      return !_.isEqual(oldToRemove, currObjInTable);
    });
  }
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
      getAllArtifacts: jasmine.createSpy('getAllArtifacts').andCallFake(function () {
        deferred = $q.defer();
        deferred.resolve({data: allArtifactsTwoServersFailed});
        return deferred.promise;
      }),
      getVersionSummary: jasmine.createSpy('getVersionSummary').andCallFake(function () {
        deferred = $q.defer();
        var newVersionSummary = clone(versionSummaryForRendererNewVersion);
        deferred.resolve(clone({data: newVersionSummary}));
        return deferred.promise;
      })
    };

    module({
      basicTestInfoServerApi: basicTestInfoServerApiMock
    });
  });

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, basicTestInfoServerResponse, _$q_, _$httpBackend_) {
    // TODO don't think it should check the server response... :\
    artifactVersions = basicTestInfoServerResponse.artifactVersions;
    allArtifactsTwoServersFailed = basicTestInfoServerResponse.allArtifacts;
    allArtifactsDifferentVersionForFailedServer = basicTestInfoServerResponse.allArtifactsDifferentVersionForFailedServer;
    versionSummaryForEditor = basicTestInfoServerResponse.versionSummaryForEditor;
    versionSummaryForRendererNewVersion = basicTestInfoServerResponse.versionSummaryForRendererNewVersion;
    versionSummaryForWar = basicTestInfoServerResponse.versionSummaryForWar;
    versionSummaryWrapperForEditorNotChosen = {artifactData: basicTestInfoServerResponse.versionSummaryForEditor.responseBody, isChosen: false, hasFailedServer: false};
    versionSummaryWrapperForEditorChosen = {artifactData: basicTestInfoServerResponse.versionSummaryForEditor.responseBody, isChosen: true, hasFailedServer: false};
    versionSummaryWrapperForRendererNewVersion = {artifactData: basicTestInfoServerResponse.versionSummaryForRendererNewVersion.responseBody, isChosen: false, hasFailedServer: true};
    versionSummaryWrapperBodyForWar = {artifactData: basicTestInfoServerResponse.versionSummaryForWar.responseBody, isChosen: false, hasFailedServer: true};
    $q = _$q_;
    $httpBackend = _$httpBackend_;
//    $provide.value('$log', console);

    scope = $rootScope.$new();
    BasicTestInfoController = $controller('BasicTestInfoController', {
      $scope: scope
    });
  }));

  describe('initialization and getting artifact data from server', function () {
    beforeEach(function () {
      initializeArtifactArrayANDFailedAndChosenArray();
    });
    it('should hold all artifacts\' information on initialization', function () {
      expect(BasicTestInfoController.basicTestInfoServerApi.getAllArtifacts).toHaveBeenCalled();
      mockServerFlush();
      // TODO is this supposed to be checked? or only if the function has been called?
      expect(BasicTestInfoController.allArtifactWrappers).toEqual(allArtifactsWrappedArray);
    });
    it('should only hold the error/warning artifacts\' data in the failedAndChosenArtifacts table', function () {
      mockServerFlush();
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(failedArtifactWrappedArray);
    });
  });
  describe('choosing an artifact to add', function () {
    beforeEach(function () {
      initializeArtifactArrayANDFailedAndChosenArray();
    });
    it('should add it to the failedAndChosenArtifacts table, and change its isChosen field in the allVersionSummary to true', function () {
      mockServerFlush();
      BasicTestInfoController.currentArtifactToAddToTable = 'wix-html-editor-webapp';
      expect(BasicTestInfoController.currentArtifactToAddToTable).toEqual('wix-html-editor-webapp');
      BasicTestInfoController.updateChosenArtifactDataToAddToTable();
      allArtifactsWrappedArray[0].isChosen = true;
      expect(BasicTestInfoController.currentArtifactToAddToTable).toEqual('');
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(allArtifactsWrappedArray);
    });
    it('should not add a it if it\'s already chosen', function () {
      mockServerFlush();
      BasicTestInfoController.currentArtifactToAddToTable = 'wix-html-editor-webapp';
      BasicTestInfoController.updateChosenArtifactDataToAddToTable();
      allArtifactsWrappedArray[0].isChosen = true;
      BasicTestInfoController.currentArtifactToAddToTable = 'wix-html-editor-webapp';
      BasicTestInfoController.updateChosenArtifactDataToAddToTable();
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(allArtifactsWrappedArray);
    });
    it('should not add it if it\'s a failed artifact', function () {
      mockServerFlush();
      BasicTestInfoController.currentArtifactToAddToTable = 'wix-public-html-renderer-webapp';
      BasicTestInfoController.updateChosenArtifactDataToAddToTable();
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(failedArtifactWrappedArray);
    });
  });
  describe('pressing on an artifact row', function () {
    it('should send a call to the server to get the version data', function () {
      var selectedRow = {entity: artifactWrapper0};
      BasicTestInfoController.onRowClick(selectedRow);
      expect(BasicTestInfoController.basicTestInfoServerApi.getVersionSummary).toHaveBeenCalled();
    });
    it('should hold the certain artifact version summary', function () {
      var selectedRow = {entity: artifactWrapper0};
      BasicTestInfoController.onRowClick(selectedRow);
      mockServerFlush();
      expect(BasicTestInfoController.serversFromClickedOnArtifacts).toEqual(versionSummaryForEditor);
      expect(BasicTestInfoController.clickedOnArtifact).toEqual({artifactId: versionSummaryForEditor[0].artifactId, groupId: versionSummaryForEditor[0].groupId, version: versionSummaryForEditor[0].version, event: versionSummaryForEditor[0].event});
    });
  });
  describe('getting different info from server on refresh', function () {
    var allArtifactsArrayFromServer;
    function cloneWrappedObjectAndChangeField(originalObject, fieldNameToChange, fieldToChangeTo) {
      var clonedAndChangedObject = clone(originalObject);
      changeObjectField(clonedAndChangedObject.artifactData, fieldNameToChange, fieldToChangeTo);
      return clonedAndChangedObject;
    }

    function changeObjectField(originalObject, fieldNameToChange, fieldToChangeTo) {
      originalObject[fieldNameToChange] = fieldToChangeTo;
    }
    beforeEach(function () {
      initializeArtifactArrayANDFailedAndChosenArray();
      allArtifactsArrayFromServer = clone(allArtifactsTwoServersFailed);
    });
    it('should not change the table if nothing has changed', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();
      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(failedArtifactWrappedArray);
      expect(BasicTestInfoController.allArtifactWrappers).toEqual(allArtifactsWrappedArray);
    })));
    it('should add an artifact to allArtifactWrapper table if it has a new artifact with a different groupId (though the artifactId is the same)', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();

      var newWrapperWithNewGroupID = cloneWrappedObjectAndChangeField(artifactWrapper0, 'groupId', 'new-wix-group');
      allArtifactsArrayFromServer.push(newWrapperWithNewGroupID.artifactData);
      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsArrayFromServer);
      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();

      allArtifactsWrappedArray.push(newWrapperWithNewGroupID);
      expect(BasicTestInfoController.allArtifactWrappers).toEqual(allArtifactsWrappedArray);
    })));
    it('should replace an artifact in allArtifacts array if it has a different version', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();

      allArtifactsArrayFromServer = filterObjectFromTable(allArtifactsArrayFromServer, artifactWrapper0.artifactData);
      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsArrayFromServer);
      var artifactWrapperWithNewVersion = cloneWrappedObjectAndChangeField(artifactWrapper0, 'version', '999');
      allArtifactsArrayFromServer.push(artifactWrapperWithNewVersion.artifactData);

      allArtifactsWrappedArray = filterObjectFromTable(allArtifactsWrappedArray, artifactWrapper0);
      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();

      allArtifactsWrappedArray.push(artifactWrapperWithNewVersion);
      expect(BasicTestInfoController.allArtifactWrappers).toEqual(allArtifactsWrappedArray);
    })));
    it('should replace an artifact in allArtifacts array if it has a different event', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();

      allArtifactsArrayFromServer = filterObjectFromTable(allArtifactsArrayFromServer, artifactWrapper0.artifactData);
      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsArrayFromServer);
      var artifactWrapperWithNewVersion = cloneWrappedObjectAndChangeField(artifactWrapper0, 'event', 'NEW_EVENT');
      allArtifactsArrayFromServer.push(artifactWrapperWithNewVersion.artifactData);

      allArtifactsWrappedArray = filterObjectFromTable(allArtifactsWrappedArray, artifactWrapper0);
      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();

      allArtifactsWrappedArray.push(artifactWrapperWithNewVersion);
      expect(BasicTestInfoController.allArtifactWrappers).toEqual(allArtifactsWrappedArray);
    })));
    it('should remove a non-failed, non-chosen artifact from failedAndChosenArtifacts array if it has a different version, has failed before', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();

      allArtifactsArrayFromServer = filterObjectFromTable(allArtifactsArrayFromServer, artifactWrapper1.artifactData);
      var artifactWrapperWithNewVersion = cloneWrappedObjectAndChangeField(artifactWrapper1, 'version', '999');
      changeObjectField(artifactWrapperWithNewVersion.artifactData, 'analysisResultEnum', 'TEST_PASSED');
      allArtifactsArrayFromServer.push(artifactWrapperWithNewVersion.artifactData);
      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsArrayFromServer);

      failedArtifactWrappedArray = filterObjectFromTable(failedArtifactWrappedArray, artifactWrapper1);
      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();

      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(failedArtifactWrappedArray);
    })));
    it('should remove a non-failed, non-chosen artifact from failedAndChosenArtifacts array if it has a different event, has failed before', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();

      allArtifactsArrayFromServer = filterObjectFromTable(allArtifactsArrayFromServer, artifactWrapper1.artifactData);
      var artifactWrapperWithNewVersion = cloneWrappedObjectAndChangeField(artifactWrapper1, 'event', 'NEW_EVENT');
      changeObjectField(artifactWrapperWithNewVersion.artifactData, 'analysisResultEnum', 'TEST_PASSED');
      allArtifactsArrayFromServer.push(artifactWrapperWithNewVersion.artifactData);
      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsArrayFromServer);

      failedArtifactWrappedArray = filterObjectFromTable(failedArtifactWrappedArray, artifactWrapper1);
      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();

      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(failedArtifactWrappedArray);
    })));
    it('should replace a failed, non-chosen artifact in the failedAndChosenArtifacts array if it has a different event, and has failed before', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();

      allArtifactsArrayFromServer = filterObjectFromTable(allArtifactsArrayFromServer, artifactWrapper1.artifactData);
      var artifactWrapperWithNewVersion = cloneWrappedObjectAndChangeField(artifactWrapper1, 'event', 'NEW_EVENT');
      allArtifactsArrayFromServer.push(artifactWrapperWithNewVersion.artifactData);
      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsArrayFromServer);

      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();

      failedArtifactWrappedArray = filterObjectFromTable(failedArtifactWrappedArray, artifactWrapper1);
      failedArtifactWrappedArray.push(artifactWrapperWithNewVersion);
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(failedArtifactWrappedArray);
    })));
    it('should replace a failed, non-chosen artifact in the failedAndChosenArtifacts array if it has a different version, and has failed before', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();

      allArtifactsArrayFromServer = filterObjectFromTable(allArtifactsArrayFromServer, artifactWrapper1.artifactData);
      var artifactWrapperWithNewVersion = cloneWrappedObjectAndChangeField(artifactWrapper1, 'version', '999');
      allArtifactsArrayFromServer.push(artifactWrapperWithNewVersion.artifactData);
      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsArrayFromServer);

      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();

      failedArtifactWrappedArray = filterObjectFromTable(failedArtifactWrappedArray, artifactWrapper1);
      failedArtifactWrappedArray.push(artifactWrapperWithNewVersion);
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(failedArtifactWrappedArray);
    })));
    it('should replace an artifact that has a different version and was chosen before to the failedAndChosenArtifacts table', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();
      BasicTestInfoController.currentArtifactToAddToTable = 'wix-html-editor-webapp';
      BasicTestInfoController.updateChosenArtifactDataToAddToTable();

      allArtifactsArrayFromServer = filterObjectFromTable(allArtifactsArrayFromServer, artifactWrapper0.artifactData);
      var artifactWrapperWithNewVersion = cloneWrappedObjectAndChangeField(artifactWrapper0, 'version', '999');
      allArtifactsArrayFromServer.push(artifactWrapperWithNewVersion.artifactData);
      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsArrayFromServer);

      changeObjectField(artifactWrapperWithNewVersion, 'isChosen', true);
      failedArtifactWrappedArray = filterObjectFromTable(failedArtifactWrappedArray, artifactWrapper0);
      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();

      failedArtifactWrappedArray.unshift(artifactWrapperWithNewVersion);
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(failedArtifactWrappedArray);
    })));
    it('should replace an artifact that has a different event and was chosen before to the failedAndChosenArtifacts table', (inject(function (basicTestInfoServerApi, $interval) {
      mockServerFlush();
      BasicTestInfoController.currentArtifactToAddToTable = 'wix-html-editor-webapp';
      BasicTestInfoController.updateChosenArtifactDataToAddToTable();

      allArtifactsArrayFromServer = filterObjectFromTable(allArtifactsArrayFromServer, artifactWrapper0.artifactData);
      var artifactWrapperWithNewVersion = cloneWrappedObjectAndChangeField(artifactWrapper0, 'event', 'NEW_EVENT');
      allArtifactsArrayFromServer.push(artifactWrapperWithNewVersion.artifactData);
      basicTestInfoServerApi.getAllArtifacts = spyFuncForGetAllArtifacts(allArtifactsArrayFromServer);

      changeObjectField(artifactWrapperWithNewVersion, 'isChosen', true);
      failedArtifactWrappedArray = filterObjectFromTable(failedArtifactWrappedArray, artifactWrapper0);
      $interval.flush(BasicTestInfoController.REFRESH_TIME);
      mockServerFlush();

      failedArtifactWrappedArray.unshift(artifactWrapperWithNewVersion);
      expect(BasicTestInfoController.failedAndChosenArtifacts).toEqual(failedArtifactWrappedArray);
    })));
  });
});
