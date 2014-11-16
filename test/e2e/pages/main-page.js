'use strict';

function MainPage() {
  this.navigate = function () {
    browser.get('/');
  };

  this.getElementByClass = function (className) {
    return $('.' + className);
  };

  this.getElement  = function (attribute) {
    return $(attribute);
  };

  this.getAllElements = function (attribute) {
    return $$(attribute);
  };

  this.artifactIdOfFailedAndChosenGridAtRow = function (row) {
    return this.getAllElements('#failed-and-chosen-grid .ngCellText.artifact-id').get(row - 1).getText();
  };

  this.clickOnFailedAndChosenRow = function (row) {
    return this.artifactIdOfFailedAndChosenGridAtRow(row).click();
  };

  this.dropDownArtifactIdAtRow = function (idx) {
    return this.getAllElements('datalist option').get(idx).getAttribute('value');
  };

  this.dropDownRow = function (idx) {
    return this.getAllElements('datalist option').get(idx);
  };

  this.getElement = function (elem) {
    return $(elem);
  };
}

module.exports = MainPage;
