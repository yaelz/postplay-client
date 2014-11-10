'use strict';

(function () {

  /* @ngInject */
  function AllArtifactsFreshener(_basicTestInfoServerApi_, _payloadExtractor_) {
    var self = this;
    this.server = _basicTestInfoServerApi_;
    this.extractor = _payloadExtractor_;
    this.getAllArtifacts = function (callback) {
      this.server.getAllArtifacts().then(function (response) {
        var payload = response.data;
        callback(self.extractor.extract(payload));
      });
    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('allArtifactsFreshener', AllArtifactsFreshener);
})();
