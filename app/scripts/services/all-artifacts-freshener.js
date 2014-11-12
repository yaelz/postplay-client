'use strict';

(function () {

  /* @ngInject */
  function AllArtifactsFreshener(_basicTestInfoServerApi_, _payloadExtractor_) {
    var self = this;
    this.server = _basicTestInfoServerApi_;
    this.extractor = _payloadExtractor_;
    this.passing = [];
    this.failing = [];
    this.getAllArtifacts = function (callback) {
      this.server.getAllArtifacts().then(function (response) {
        var payload = response.data;
        var passingAndFailing = self.extractor.extract(payload);
//        self.passing = passingAndFailing.passing;
//        self.failing = passingAndFailing.failing;
        callback(passingAndFailing);
      });
    };
//    this.updateChosenArtifact = function (artifactIdGroupId) {
////      var artifactId = artifactIdGroupId[0];
////      var groupId = artifactIdGroupId[1].substring(1);
//    };
  }

  angular
    .module('postplayTryAppInternal')
    .service('allArtifactsFreshener', AllArtifactsFreshener);
})();
