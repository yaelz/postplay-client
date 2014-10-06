'use strict';

(function () {

  /* @ngInject */
  function SpecificServerStatusController(specificServerStatusServerApi, serverStatusCtrlDTO) {
    this.specificServerStatusServerApi = specificServerStatusServerApi;
    this.specificServerStatusServerApi.getServerData(serverStatusCtrlDTO.server, serverStatusCtrlDTO.artifactId, serverStatusCtrlDTO.groupId);
  }

  angular
    .module('postplayTryAppInternal')
    .controller('SpecificServerStatusController', SpecificServerStatusController);

})();
