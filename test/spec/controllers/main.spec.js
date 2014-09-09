'use strict';

describe('Controller: MainController', function () {

  var allArtifacts, artifactVersions, versionSummary;
  // load the controller's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
    artifactVersions = ['2.470.0', '2.469.0', '2.468.0', '2.467.0', '2.466.0', '2.465.0', '2.464.0', '2.463.0', '2.462.0', '2.461.0'];
    allArtifacts = [
      {monitoredArtifactId: 1, artifactId: 'wix-html-editor-webapp', groupId: 'com.wixpress', version: null, name: '2. Wix Html Editor', dynamic: false, tests: [], testRuns: []},
      {monitoredArtifactId: 31, artifactId: 'wix-public-html-renderer-webapp', groupId: 'com.wixpress', version: null, name: '2. Wix Public Html Renderer', dynamic: false, tests: [], testRuns: []},
      {monitoredArtifactId: 21, artifactId: 'wix-public-war', groupId: 'com.wixpress', version: null, name: 'Wix Public', dynamic: false, tests: [], testRuns: []}
    ];
    versionSummary = {code: 0, message: 'OK', comments: null, responseBody:
    [{artifactId: 'wix-public-html-renderer-webapp', groupId: 'com.wixpress', server: 'app30.aus.wixpress.com', version: '2.487.0', analysisResultStatus: 'TEST_FAILED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', errorFields: null, runStatus: 'FINISHED', comments: 'Failed on errorRate', event: 'TESTBED'}]};
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

  var MainController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainController = $controller('MainController', {
      $scope: scope
    });
  }));

  function updateArtifactData() {
    MainController.currentArtifactId = 'wix-public-html-renderer-webapp';
    MainController.updateCurrentArtifactData();
  }

  it('should hold an artifact version iff the artifact id is empty', function () {
    if (MainController.currentArtifactId === '') {
      expect(MainController.currentArtifactVersions).toEqual([]);
    } else {
      expect(MainController.currentArtifactVersions).not.toEqual([]);
    }
  });

  it('should hold the last version of the current artifact', function () {
    updateArtifactData();
    expect(MainController.currentArtifactVersions).toEqual(artifactVersions);
  });

  it('should hold all artifacts information on initialization', function () {
    expect(MainController.artifacts).toEqual(allArtifacts);
  });

  it('should hold the latest group id of the current artifact', function () {
    updateArtifactData();
    expect(MainController.currentArtifactGroupId).toEqual(allArtifacts[1].groupId);
  });

  it('should hold the latest artifact version summary', (inject(function ($timeout) {
    updateArtifactData();
    $timeout.flush();
    expect(MainController.currentArtifactVersionSummary).toEqual(versionSummary);
  })));
});
