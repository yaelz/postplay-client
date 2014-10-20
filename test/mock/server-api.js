'use strict';

angular.module('postplayTryAppMocks', ['ngMockE2E'])
  .run(function ($httpBackend, basicTestInfoServerResponse, serverApiUrl, specificServerData, specificServerData2, specificServerData3, specificServerServerResponse) {
    $httpBackend.whenGET(serverApiUrl.ALL_ARTIFACTS_API_URL).respond(basicTestInfoServerResponse.allArtifacts);

    $httpBackend.whenGET(serverApiUrl.BUILDS_API_URL).respond(basicTestInfoServerResponse.lifecycleBuilds);

    function callsWithSpecificServerData(serverData) {
      console.log('Version: ' + serverData.version);
      console.log('ArtifactId: ' + serverData.artifactId);
      var VER_SUM_API_URL = serverApiUrl.VER_SUM_API_URL_PREFIX + serverData.version + '&artifactId=' + serverData.artifactId + '&groupId=' + serverData.groupId;
      $httpBackend.whenGET(VER_SUM_API_URL).respond(basicTestInfoServerResponse.versionSummaryForRenderer);
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
