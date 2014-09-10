'use strict';

angular.module('postplayTryAppMocks', ['ngMockE2E'])
  .run(function ($httpBackend, serverResponse, serverApiUrl) {
    $httpBackend.whenGET(serverApiUrl.ALL_ARTIFACTS_API_URL).respond(serverResponse.allArtifacts);

    $httpBackend.whenGET(serverApiUrl.BUILDS_API_URL).respond(serverResponse.lifecycleBuilds);

    var VER_SUM_API_URL = serverApiUrl.VER_SUM_API_URL_PREFIX + serverApiUrl.version + '&artifactId=' + serverApiUrl.artifactId + '&groupId=' + serverApiUrl.groupId;
    $httpBackend.whenGET(VER_SUM_API_URL).respond(serverResponse.versionSummary);

    var ARTIFACT_VERS_API_URL = serverApiUrl.ARTIFACT_VERS_API_URL_PREFIX + serverApiUrl.artifactId + '&groupId=' + serverApiUrl.groupId;
    $httpBackend.whenGET(ARTIFACT_VERS_API_URL).respond(serverResponse.artifactVersions);

    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
  });
