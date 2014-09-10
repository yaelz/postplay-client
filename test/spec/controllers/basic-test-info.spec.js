'use strict';

describe('Controller: BasicTestInfoController', function () {

  var allArtifacts, artifactVersions, versionSummary;
  // load the controller's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
    var basicTestInfoServerApiMock = {
      getArtifactVersions: jasmine.createSpy('getArtifactVersions').andCallFake(function () {
        return artifactVersions;
      }),
      getAllArtifacts: jasmine.createSpy('getAllArtifacts').andCallFake(function () {
        return allArtifacts;
      }),
      getVersionSummary: jasmine.createSpy('getVersionSummary').andCallFake(function () {
        return versionSummary;
      })
    };

    module({
      basicTestInfoServerApi: basicTestInfoServerApiMock
    });
  });

  var BasicTestInfoController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, serverResponse) {
    artifactVersions = serverResponse.artifactVersions;
    allArtifacts = serverResponse.allArtifacts;
    versionSummary = serverResponse.versionSummary;
    scope = $rootScope.$new();
    BasicTestInfoController = $controller('BasicTestInfoController', {
      $scope: scope
    });
  }));

  function updateArtifactData() {
    BasicTestInfoController.currentArtifactId = 'wix-public-html-renderer-webapp';
    BasicTestInfoController.updateCurrentArtifactData();
  }

  it('should hold an artifact version iff the artifact id is empty', function () {
    if (BasicTestInfoController.currentArtifactId === '') {
      expect(BasicTestInfoController.currentArtifactVersions).toEqual([]);
    } else {
      expect(BasicTestInfoController.currentArtifactVersions).not.toEqual([]);
    }
  });

  it('should hold all artifacts information on initialization', function () {
    expect(BasicTestInfoController.artifacts).toEqual(allArtifacts);
  });

  it('should hold the last version of the current artifact', function () {
    updateArtifactData();
    expect(BasicTestInfoController.currentArtifactVersions).toEqual(artifactVersions);
  });

  it('should hold the latest group id of the current artifact', function () {
    updateArtifactData();
    expect(BasicTestInfoController.currentArtifactGroupId).toEqual(allArtifacts[1].groupId);
  });

  it('should hold the latest artifact version summary', (inject(function ($timeout) {
    updateArtifactData();
    $timeout.flush();
    expect(BasicTestInfoController.currentArtifactVersionSummary).toEqual(versionSummary);
    expect(BasicTestInfoController.currentArtifactVersionSummary).not.toBe(undefined);
  })));
});
