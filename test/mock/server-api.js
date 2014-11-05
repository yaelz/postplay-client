'use strict';

angular.module('postplayTryAppMocks', ['ngMockE2E'])
  .run(function ($httpBackend, basicTestInfoServerResponse, serverApiUrl, specificServerData) {
//  .run(function ($httpBackend, basicTestInfoServerResponse, serverApiUrl, specificServerData, specificServerData2, specificServerData3, specificServerServerResponse) {
    $httpBackend.whenGET(serverApiUrl.ALL_ARTIFACTS_API_URL).respond(basicTestInfoServerResponse.allArtifacts);

    $httpBackend.whenGET(serverApiUrl.BUILDS_API_URL).respond(basicTestInfoServerResponse.lifecycleBuilds);

    function callsWithSpecificServerData(serverData, artifactId, versionSummaryForArtifact) {
      var VER_SUM_API_URL = serverApiUrl.VER_SUM_API_URL_PREFIX + versionSummaryForArtifact[0].version + '&artifactId=' + artifactId + '&groupId=' + versionSummaryForArtifact[0].groupId + '&event=' + versionSummaryForArtifact[0].event;
      $httpBackend.whenGET(VER_SUM_API_URL).respond(versionSummaryForArtifact);
//    $httpBackend.whenGET(serverApiUrl.CURRENTLY_RUNNING_ARTIFACTS_API_URL).respond(500);
//      $httpBackend.whenGET(serverApiUrl.CURRENTLY_RUNNING_ARTIFACTS_API_URL).respond(basicTestInfoServerResponse.currentlyRunningArtifacts);
//      var API_URL = serverApiUrl.SERVER_STATUS_API_URL_PREFIX + serverData.server + '&artifactId=' + artifactId + '&groupId=' + versionSummaryForArtifact.responseBody.groupId;
//      $httpBackend.whenGET(API_URL).respond(specificServerServerResponse.serverData);
    }
    var editorArtifactId = basicTestInfoServerResponse.versionSummaryForEditor[0].artifactId;
    callsWithSpecificServerData(specificServerData, editorArtifactId, basicTestInfoServerResponse.versionSummaryForEditor);
    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
  });
