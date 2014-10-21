'use strict';

angular.module('postplayTryAppMocks', ['ngMockE2E'])
  .run(function ($httpBackend, basicTestInfoServerResponse, serverApiUrl, specificServerData, specificServerData2, specificServerData3, specificServerServerResponse) {
    $httpBackend.whenGET(serverApiUrl.ALL_ARTIFACTS_API_URL).respond(basicTestInfoServerResponse.allArtifacts);
    $httpBackend.whenGET(serverApiUrl.ALL_FAILED_ARTIFACTS_API_URL).respond(basicTestInfoServerResponse.allFailedArtifacts);

    $httpBackend.whenGET(serverApiUrl.BUILDS_API_URL).respond(basicTestInfoServerResponse.lifecycleBuilds);

    function callsWithSpecificServerData(serverData, artifactId, versionSummaryForArtifact) {
      var VER_SUM_API_URL = serverApiUrl.VER_SUM_API_URL_PREFIX + serverData.version + '&artifactId=' + artifactId + '&groupId=' + serverData.groupId + '&event=' + serverData.event;
      $httpBackend.whenGET(VER_SUM_API_URL).respond(versionSummaryForArtifact);
      var ARTIFACT_VERS_API_URL = serverApiUrl.ARTIFACT_VERS_API_URL_PREFIX + artifactId + '&groupId=' + serverData.groupId;
      $httpBackend.whenGET(ARTIFACT_VERS_API_URL).respond(basicTestInfoServerResponse.artifactVersions);
//    $httpBackend.whenGET(serverApiUrl.CURRENTLY_RUNNING_ARTIFACTS_API_URL).respond(500);
      $httpBackend.whenGET(serverApiUrl.CURRENTLY_RUNNING_ARTIFACTS_API_URL).respond(basicTestInfoServerResponse.currentlyRunningArtifacts);
      var API_URL = serverApiUrl.SERVER_STATUS_API_URL_PREFIX + serverData.server + '&artifactId=' + artifactId + '&groupId=' + serverData.groupId;
      $httpBackend.whenGET(API_URL).respond(specificServerServerResponse.serverData);
    }
    var editorArtifactId = basicTestInfoServerResponse.versionSummaryForEditor.responseBody.artifactId;
    var rendererArtifactId = basicTestInfoServerResponse.versionSummaryForRenderer.responseBody.artifactId;
    var warArtifactId = basicTestInfoServerResponse.versionSummaryForWar.responseBody.artifactId;
    callsWithSpecificServerData(specificServerData, editorArtifactId, basicTestInfoServerResponse.versionSummaryForEditor);
    callsWithSpecificServerData(specificServerData2, rendererArtifactId, basicTestInfoServerResponse.versionSummaryForRenderer);
    callsWithSpecificServerData(specificServerData3, warArtifactId, basicTestInfoServerResponse.versionSummaryForWar);
    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
  });
