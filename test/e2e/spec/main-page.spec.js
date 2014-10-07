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
        angular.module('initialGetMock', ['ngMockE2E']).run(function ($httpBackend, basicTestInfoServerResponse, serverApiUrl, specificServerData, specificServerData2, specificServerData3,  specificServerServerResponse) {
          $httpBackend.whenGET(serverApiUrl.ALL_ARTIFACTS_API_URL).respond(basicTestInfoServerResponse.allArtifacts);
          function callsWithSpecificServerData(serverData) {
            var VER_SUM_API_URL = serverApiUrl.VER_SUM_API_URL_PREFIX + serverData.version + '&artifactId=' + serverData.artifactId + '&groupId=' + serverData.groupId;
            $httpBackend.whenGET(VER_SUM_API_URL).respond(basicTestInfoServerResponse.versionSummary);
            var ARTIFACT_VERS_API_URL = serverApiUrl.ARTIFACT_VERS_API_URL_PREFIX + serverData.artifactId + '&groupId=' + serverData.groupId;
            $httpBackend.whenGET(ARTIFACT_VERS_API_URL).respond(basicTestInfoServerResponse.artifactVersions);
//    $httpBackend.whenGET(serverApiUrl.CURRENTLY_RUNNING_ARTIFACTS_API_URL).respond(500);
            $httpBackend.whenGET(serverApiUrl.CURRENTLY_RUNNING_ARTIFACTS_API_URL).respond(basicTestInfoServerResponse.currentlyRunningArtifacts);
            var API_URL = serverApiUrl.SERVER_STATUS_API_URL_PREFIX + serverData.server + '&artifactId=' + serverData.artifactId + '&groupId=' + serverData.groupId;
            $httpBackend.whenGET(API_URL).respond(specificServerServerResponse.serverData);
          }
          callsWithSpecificServerData(specificServerData);
          callsWithSpecificServerData(specificServerData2);
          callsWithSpecificServerData(specificServerData3);

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
//      browser.pause();
      expect(mainPage.getElementById('pp-gs-table-container').isDisplayed()).toBe(true);
    });
    it('should move to another page when clicking on a cell', function () {
      mainPage.navigate();
      mainPage.clickOnCellInTable();
      expect(browser.getCurrentUrl()).toMatch(/artifactId/);
    });
  });

});
