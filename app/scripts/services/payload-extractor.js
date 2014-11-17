'use strict';
(function () {

  function PayloadExtractor(postPlayUtils) {
    this.extract = function (payload) {
      return postPlayUtils.getFailedAndFavouriteAndPassedArtifactsObject(payload);
    };
  }
  angular
    .module('postplayTryAppInternal')
    .service('payloadExtractor', PayloadExtractor);
})();
