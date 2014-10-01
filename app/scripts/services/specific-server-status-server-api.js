'use strict';

(function () {

  /* @ngInject */
  function SpecificServerStatusServerApi($http, serverApiUrl) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.serverResponseBody = {};
    this.isDataLoaded = false;
    var self = this;

    // Public API here
    this.getServerData = function (server, artifactId, groupId) {
      var API_URL = serverApiUrl.SERVER_STATUS_API_URL_PREFIX + server + '&artifactId=' + artifactId + '&groupId=' + groupId;
      $http.get(API_URL)
        .then(function (response) {
          angular.copy(response.data.responseBody, self.serverResponseBody);
          self.isDataLoaded = true;
        });
    };
    this.getArtifactId = function () {
      return self.serverResponseBody.artifactId;
    };
    this.getArtifactName = function () {
      return self.serverResponseBody.artifactName;
    };
    this.getVersion = function () {
      return self.serverResponseBody.version;
    };
    this.getServerName = function () {
      return self.serverResponseBody.server;
    };
    this.getTotalNumberOfRuns = function () {
      return self.serverResponseBody.runs.totalNumberOfRuns;
    };
    this.getNumberOfCompletedRuns = function () {
      return self.serverResponseBody.runs.completedNumberOfRuns;
    };
    this.getRuns = function () {
      return self.serverResponseBody.runs.runs;
    };
    this.getCompletedTestsPercent = function () {
      return self.serverResponseBody.completedTestsPercent;
    };
    this.myData = [
      {runStatus: 'Moroni', startTime: 50, endTime: 100},
      {name: 'Tiancum', age: 43},
      {name: 'Jacob', age: 27},
      {name: 'Nephi', age: 29},
      {name: 'Enos', age: 34}
    ];
    this.gridOptions = {
      data: 'serverStatusCtrl.specificServerStatusServerApi.getRuns()',
      columnDefs: [
        { field: 'runStatus', width: 120, displayName: 'Run Status', resizable: true},
        { field: 'startTime', displayName: 'Start Time', width: 120 },
        { field: 'endTime', displayName: 'End Time', width: 120 }
      ]
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('specificServerStatusServerApi', SpecificServerStatusServerApi);

})();
