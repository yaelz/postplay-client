'use strict';

(function () {

  /* @ngInject */
  function SpecificServerStatusController(specificServerStatusServerApi, specificServerData) {
    this.specificServerStatusServerApi = specificServerStatusServerApi;
    this.specificServerStatusServerApi.getServerData(specificServerData.server, specificServerData.artifactId, specificServerData.groupId);
  }

  angular
    .module('postplayTryAppInternal')
    .controller('SpecificServerStatusController', SpecificServerStatusController);

})();
