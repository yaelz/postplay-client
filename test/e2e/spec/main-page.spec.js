'use strict';

require('../lib/matchers.protractor.js');
//require('../lib/experiments-mock.js');
var MainPage = require('../pages/main-page.js');

describe('postplayTryApp', function () {
  var mainPage;

  function makeServerReturn(payload) {
    browser.addMockModule('experimentsMock', function (myPayload) {
      angular.module('experimentsMock', []).run(function (serverLogic) {
        serverLogic.getAllArtifacts = function () {
          return myPayload;
        };
      });
    }, payload);
  }
  function assumingServerHasArtifacts(artifacts) {
    makeServerReturn(artifacts);
    mainPage.navigate();
  }

  beforeEach(function () {
    mainPage = new MainPage();
  });

  function aFailedArtifact() {
    return {analysisResultEnum: 'TEST_FAILED'};
  }

  function aPassedArtifact() {
    return {testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED'};
  }

  describe('Basic test info', function () {
    afterEach(function () {
      browser.removeMockModule('initialGetMock');
    });

    describe('All artifacts data page', function () {

      it('should load successfully', function () {
        assumingServerHasArtifacts([]);
        expect(mainPage.getElement('#failed-table-title').isDisplayed()).toBe(true);
      });

      it('should hold a single failed artifact in the artifacts\' grid', function () {
        var failedArtifact = aFailedArtifact();
        failedArtifact.artifactId = 'wix-html-artifact-YAAAAA';
        assumingServerHasArtifacts([failedArtifact]);
        expect(mainPage.getElement('#failed-and-chosen-grid .ngCellText.col1').getText()).toEqual('wix-html-artifact-YAAAAA');
      });

      it('should display all failed artifacts in the artifacts\' grid', function () {
        var failedArtifact1 = aFailedArtifact();
        failedArtifact1.artifactId = 'failed_1';

        var failedArtifact2 = aFailedArtifact();
        failedArtifact2.artifactId = 'failed_2';

        assumingServerHasArtifacts([failedArtifact1, failedArtifact2]);
        expect(mainPage.artifactIdOfFailedAndChosenGridAtRow(1)).toEqual('failed_1');
        expect(mainPage.artifactIdOfFailedAndChosenGridAtRow(2)).toEqual('failed_2');
      });

      it('should hold all passing artifacts in the drop-down menu', function () {
        var passedArtifact1 = aPassedArtifact();
        passedArtifact1.artifactId = 'passed_1';

        var passedArtifact2 = aPassedArtifact();
        passedArtifact2.artifactId = 'passed_2';

        assumingServerHasArtifacts([passedArtifact1, passedArtifact2]);
        expect(mainPage.artifactIdOfPassed(0)).toEqual('passed_1');
        expect(mainPage.artifactIdOfPassed(1)).toEqual('passed_2');
      });

//      it('should hold all passing artifacts in the artifacts grid', function () {
//        var passedArtifact = getPassedArtifact();
//        passedArtifact.artifactId = 'wix-html-editor-webapp';
//        passedArtifact.groupId = 'com.wixpress';
//
//        assumingServerHasArtifacts([passedArtifact]);
//        var ptor = protractor.getInstance();
//        ptor.get('#/');
//        var passingArtifacts = ptor.findElement(protractor.By.model('passingArtifacts'));
////        var passingArtifacts = element.all(by.binding('basicTestInfoCtrl.passingArtifacts'));
//        expect(passingArtifacts).toEqual([passedArtifact]);
//      });

//      it('should update the artifacts\' grid when selecting an artifact from the drop-down menu', function () {
//        var failedArtifact = aFailedArtifact();
//        failedArtifact.artifactId = 'wix-html-artifact-YAAAAA';
//        failedArtifact.groupId = 'com.wixpress';
//        var passedArtifactId = 'wix-html-editor-webapp';
//        var passedArtifact = getPassedArtifact();
//        passedArtifact.artifactId = passedArtifactId;
//        passedArtifact.groupId = 'com.wixpress';
//        assumingServerHasArtifacts([
//          failedArtifact,
//          passedArtifact
//        ]);
//        var ptor = protractor.getInstance();
//        ptor.get('#/');
//        var artifactToAddToTable = ptor.findElement(protractor.By.model('basicTestInfoCtrl.currentArtifactToAddToTable'));
//        var form = ptor.findElement(protractor.By.name('choose-artifact-form'));
//        var artifactIdGroupId = passedArtifactId + ', ' + 'com.wixpress';
//        artifactToAddToTable.sendKeys(artifactIdGroupId);
//        form.submit();
//        expect(mainPage.getElementByAttribute('.ngCellText.col1').getText()).toEqual(passedArtifactId);
////        artifactToAddToTable = ptor.findElement(protractor.By.model('basicTestInfoCtrl.currentArtifactToAddToTable'));
////        expect(artifactToAddToTable.getText()).toEqual('wix-html-editor-webapp');
//      });
    });
  });

});
