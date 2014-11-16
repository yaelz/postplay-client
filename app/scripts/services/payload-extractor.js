'use strict';
(function () {

  function PayloadExtractor(postPlayUtils) {
    this.extract = function (payload) {
      return postPlayUtils.getFailedAndNotFailedArtifactsObject(payload);
    };
  }
  angular
    .module('postplayTryAppInternal')
    .service('payloadExtractor', PayloadExtractor);
})();
