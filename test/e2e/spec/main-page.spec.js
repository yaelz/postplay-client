'use strict';

require('../lib/matchers.protractor.js');
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

    describe('All artifacts page', function () {
      it('should load successfully', function () {
        assumingServerHasArtifacts([]);
        expect(mainPage.getElement('#failed-table-title').isDisplayed()).toBe(true);
      });
      describe('failed and chosen artifacts\' grid', function () {
        it('should hold a single failed artifact', function () {
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

        it('should create a new table of artifact version summary when clicking on a row in the artifacts\' grid', function () {
          var failedArtifact = aFailedArtifact();
          failedArtifact.artifactId = 'failed_1';
          failedArtifact.groupId = 'group';

          assumingServerHasArtifacts([failedArtifact]);
          expect(mainPage.getElement('#servers-info-grid').isDisplayed()).toBe(false);
          mainPage.clickOnFailedAndChosenRow(0).click();
          expect(mainPage.getElement('#servers-info-grid').isDisplayed()).toBe(true);
        });
      });
      describe('passing artifacts\' drop down menu', function () {
        it('should hold all passing artifacts', function () {
          var passedArtifact1 = aPassedArtifact();
          passedArtifact1.artifactId = 'passed_1';

          var passedArtifact2 = aPassedArtifact();
          passedArtifact2.artifactId = 'passed_2';

          assumingServerHasArtifacts([passedArtifact1, passedArtifact2]);
          expect(mainPage.dropDownArtifactIdAtRow(0)).toEqual('passed_1');
          expect(mainPage.dropDownArtifactIdAtRow(1)).toEqual('passed_2');
        });

        it('should update the artifacts\' grid when selecting an artifact', function () {
          var passedArtifact1 = aPassedArtifact();
          passedArtifact1.artifactId = 'passed_1';
          var passedArtifact2 = aPassedArtifact();
          passedArtifact2.artifactId = 'passed_2';

          var failedArtifact1 = aFailedArtifact();
          failedArtifact1.artifactId = 'failed_1';

          assumingServerHasArtifacts([passedArtifact1, passedArtifact2, failedArtifact1]);

          // TODO Ofir - help!
          mainPage.dropDownArtifactIdAtRow(0)
            .then(function (chosenArtifactFromDropDown) {
              $('.pp-artifact-input').sendKeys(chosenArtifactFromDropDown)
                .then(function () {
                  expect(mainPage.artifactIdOfFailedAndChosenGridAtRow(1)).toEqual(passedArtifact1.artifactId);
                  expect(mainPage.dropDownArtifactIdAtRow(0)).toEqual('passed_2');
                });
            });
        });
      });
    });
  });

});
