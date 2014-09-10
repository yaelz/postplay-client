'use strict';

beforeEach(function () {
  this.mockExperiments = function (experiments) {
    browser.addMockModule('experimentsMock', function (experiments) {
      angular.module('experimentsMock', []).run(function (wixAngular) {
        angular.copy(experiments, wixAngular.experiments);
      });
    }, experiments);
  };

  this.mockExperiments({});
});

afterEach(function () {
  browser.removeMockModule('experimentsMock');
});
