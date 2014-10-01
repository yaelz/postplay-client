'use strict';

function MainPage() {
  this.navigate = function () {
    browser.get('/');
  };

  this.getElementByClass = function (className) {
    return $('.' + className);
  };

  this.getElementTextByClass = function (className) {
    return this.getElementByClass(className).getText();
  };

  this.getElementById = function (id) {
    return $('#' + id);
  };

  this.getElementTextById = function (id) {
    return this.getElementById(id).getText();
  };

  this.setArtifactInputText = function (inputText) {
    this.getElementByClass('pp-artifact-input').sendKeys(inputText);
  };

//  this.clickOnGoButton = function () {
//    $('#go-button').click();
//  };
}

module.exports = MainPage;
