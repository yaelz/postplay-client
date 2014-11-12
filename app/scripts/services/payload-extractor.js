'use strict';
/**
 * Created by Yael_Zaritsky on 11/10/14.
 */
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
