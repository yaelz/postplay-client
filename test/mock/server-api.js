'use strict';

angular.module('postplayTryAppMocks', ['ngMockE2E'])
  .service('serverLogic', function () {
    this.getAllArtifacts = function () {
//      return basicTestInfoServerResponse.allArtifacts;
      return [
        {artifactId: 'wix-html-editor-webapp13', groupId: 'com.wixpress', version: '2.490.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED', startTime: 1414663552086},
        {artifactId: 'wix-html-editor-webapp3', groupId: 'com.wixpress', version: '2.490.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED', startTime: 1414663552086},
        {artifactId: 'wix-html-editor-webapp2', groupId: 'com.wixpress', version: '2.490.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED', startTime: 1414663552086},
        {artifactId: 'wix-html-editor-webapp1', groupId: 'com.wixpress', version: '2.490.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED', startTime: 1414663552086},
        {artifactId: 'wix-html-artifact1', groupId: 'com.wixpress', version: '2.487.7', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_FAILED', startTime: 1414663552086},
        {artifactId: 'wix-html-artifact2', groupId: 'com.wixpress', version: '2.487.0', event: 'TESTBED', artifactName: '2. Wix Html Editor', runStatusEnum: 'FINISHED', testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_FAILED', startTime: 1414663552086}
      ];
    };
  })
  .run(function ($httpBackend, serverApiUrl, serverLogic) {
    $httpBackend.whenGET(serverApiUrl.PREFIX + serverApiUrl.ALL_ARTIFACTS_API_URL).respond(function () {
      return [200, serverLogic.getAllArtifacts()];
    });

    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
  });
