'use strict';

require('../lib/matchers.protractor.js');
//require('../lib/experiments-mock.js');
var MainPage = require('../pages/main-page.js');

describe('postplayTryApp', function () {
  var mainPage;

  beforeEach(function () {
    mainPage = new MainPage();
  });

  describe('Basic test info', function () {
    beforeEach(function () {
      browser.addMockModule('initialGetMock', function () {
        angular.module('initialGetMock', ['ngMockE2E']).run(function ($httpBackend, basicTestInfoServerResponse, serverApiUrl) {
          $httpBackend.whenGET(serverApiUrl.ALL_ARTIFACTS_API_URL).respond(basicTestInfoServerResponse.allArtifacts);

          $httpBackend.whenGET(serverApiUrl.BUILDS_API_URL).respond(basicTestInfoServerResponse.lifecycleBuilds);

          var VER_SUM_API_URL = serverApiUrl.VER_SUM_API_URL_PREFIX + serverApiUrl.version + '&artifactId=' + serverApiUrl.artifactId + '&groupId=' + serverApiUrl.groupId;
          $httpBackend.whenGET(VER_SUM_API_URL).respond(basicTestInfoServerResponse.versionSummary);

          var ARTIFACT_VERS_API_URL = serverApiUrl.ARTIFACT_VERS_API_URL_PREFIX + serverApiUrl.artifactId + '&groupId=' + serverApiUrl.groupId;
          $httpBackend.whenGET(ARTIFACT_VERS_API_URL).respond(basicTestInfoServerResponse.artifactVersions);

          $httpBackend.whenGET(serverApiUrl.CURRENTLY_RUNNING_ARTIFACTS_API_URL).respond(basicTestInfoServerResponse.currentlyRunningArtifacts);

          $httpBackend.whenGET(/.*/).passThrough();
          $httpBackend.whenPOST(/.*/).passThrough();
          $httpBackend.whenPUT(/.*/).passThrough();
          $httpBackend.whenDELETE(/.*/).passThrough();
        });
      });
    });

    afterEach(function () {
      browser.removeMockModule('initialGetMock');
    });

    it('should load successfully', function () {
      mainPage.navigate();
      expect(mainPage.getElementTextByClass('pp-artifacts-title')).toEqual('Choose your artifact!');
    });

    it('should update the top header text when inserting input in the artifact-input', function () {
      mainPage.navigate();
      var inputText = 'input-text';
      mainPage.setArtifactInputText(inputText);
      expect(mainPage.getElementTextByClass('pp-top-header-text')).toEqual(inputText);
    });

    it('should hold the artifact id, group id and version of the artifact after selecting an artifact', function () {
      mainPage.navigate();
      var artifactId = 'wix-public-html-renderer-webapp';
      var groupId = 'com.wixpress';
      var artifactVersion = '2.487.0';
      mainPage.setArtifactInputText(artifactId);
      mainPage.clickOnGoButton();
      expect(mainPage.getElementTextById('artifact-id')).toEqual(artifactId);
      expect(mainPage.getElementTextById('group-id')).toEqual(groupId);
      expect(mainPage.getElementTextById('artifact-version')).toEqual(artifactVersion);
    });

    it('should hold the currently running artifacts', function () {
      mainPage.navigate();
      expect(mainPage.getElementTextById('pp-currently-running-' + 0)).toEqual('wix-public-html-renderer-webapp');
      expect(mainPage.getElementTextById('pp-currently-running-' + 1)).toEqual('wix-public-my-app-keiloo');
    });
  });

});
