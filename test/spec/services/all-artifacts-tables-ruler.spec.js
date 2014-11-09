'use strict';

describe('Service: allArtifactsTablesRuler', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var allArtifactsTablesRuler;
  beforeEach(inject(function (_allArtifactsTablesRuler_) {
    allArtifactsTablesRuler = _allArtifactsTablesRuler_;
  }));

  it('should hold artifactsTablesEntity', function () {
    expect(allArtifactsTablesRuler.artifactsTablesEntity).toBeDefined();
  });

});
