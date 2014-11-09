'use strict';

describe('Service: artifactsTablesEntity', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var artifactsTablesEntity, tableToBe;
  var artifactWrapper = {artifactData: {artifactId: 'wix-1'}, isChosen: false, status: 'PASSED'};
  var artifactWrapperToStay = {artifactData: {artifactId: 'wix-2'}, isChosen: false, status: 'PASSED'};

  beforeEach(inject(function (_artifactsTablesEntity_) {
    artifactsTablesEntity = _artifactsTablesEntity_;
    tableToBe = [];
  }));

  describe('failedAndChosen table', function () {
    it('should be able to have an object added to', function () {
      artifactsTablesEntity.addToFailedAndChosenTable(artifactWrapper);
      tableToBe.push(artifactWrapper);
      expect(artifactsTablesEntity.failedAndChosenWrappedArtifacts).toEqual(tableToBe);
    });
    it('should be able to have an artifact wrapper object removed from', function () {
      artifactsTablesEntity.failedAndChosenWrappedArtifacts = [artifactWrapper, artifactWrapperToStay];

      var artifactWrapperToRemove = _.clone(artifactWrapper);
      artifactsTablesEntity.removeFromFailedAndChosenTable(artifactWrapperToRemove);
      expect(artifactsTablesEntity.failedAndChosenWrappedArtifacts).toEqual([artifactWrapperToStay]);
    });
  });
  describe('passedWrappedArtifacts table', function () {
    it('should be able to have an artifact wrapper object added to', function () {
      artifactsTablesEntity.addToPassedArtifactsTable(artifactWrapper);
      tableToBe.push(artifactWrapper);
      expect(artifactsTablesEntity.passedWrappedArtifacts).toEqual(tableToBe);
    });
    it('should be able to have an artifact wrapper object removed from', function () {
      artifactsTablesEntity.passedWrappedArtifacts = [artifactWrapper, artifactWrapperToStay];

      var artifactWrapperToRemove = _.clone(artifactWrapper);
      artifactsTablesEntity.removeFromPassedArtifactsTable(artifactWrapperToRemove);
      expect(artifactsTablesEntity.passedWrappedArtifacts).toEqual([artifactWrapperToStay]);
    });
  });

});
