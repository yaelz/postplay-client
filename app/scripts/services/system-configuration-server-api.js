'use strict';

(function () {

  /* @ngInject */
  function SystemConfigurationServerApi(systemConfigurationServerResponse, $http, serverApiUrl) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var testData = {};
    var artifactData = {};
    var templates = [];
    var expressionSyntax = [];

    // Public API here
    this.getTestDataById = function (testId) {
      var API_URL = serverApiUrl.TEST_DATA_BY_ID_API_URL_PREFIX + '?testId=' + testId;
      return runHttpGetSuccessAndError(API_URL, testData);
    };

    this.getArtifactData = function (artifactId, groupId) {
      var API_URL = serverApiUrl.ARTIFACT_DATA_API_URL_PREFIX + '?artifactId=' + artifactId + '?groupId=' + groupId;
      return runHttpGetSuccessAndError(API_URL, artifactData);
    };

    this.getAllTemplates = function () {
      return runHttpGetSuccessAndError(serverApiUrl.TEMPLATES_API_URL, templates);
    };

    this.getExpressionSyntax = function () {
      return runHttpGetSuccessAndError(serverApiUrl.EXPRESSION_SYNTAX_API_URL, expressionSyntax);
    };

    function runHttpGetSuccessAndError(API_URL, destinationVariable) {
      $http.get(API_URL)
        .success(function (response) {
          angular.copy(response, destinationVariable);
        })
        .error(function () {});
      return destinationVariable;
    }
  }

  angular
    .module('postplayTryAppInternal')
    .service('systemConfigurationServerApi', SystemConfigurationServerApi);

})();
