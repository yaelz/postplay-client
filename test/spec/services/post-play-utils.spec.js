'use strict';

describe('Service: postPlayUtils', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  function aFailedArtifact() {
    return {analysisResultEnum: 'TEST_FAILED'};
  }

  function aPassedArtifact() {
    return {testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED'};
  }
  // instantiate service
  var postPlayUtils;
  beforeEach(inject(function (_postPlayUtils_) {
    postPlayUtils = _postPlayUtils_;
  }));
  describe('filter', function () {
    it('should be able to filter an object from an array (with deep equality check)', function () {
      var array = [{a: 1, b: 2, c: []}, {whiz: 'kid'}];
      var filteredArray = postPlayUtils.filter(array, {whiz: 'kid'});
      expect(filteredArray).toEqual([{a: 1, b: 2, c: []}]);
    });
  });
  describe('getArtifactStatus', function () {
    it('should return \'PASSED\' iff the testStatusEnum and the analysisResultEnum have both passed', function () {
      expect(postPlayUtils.getArtifactStatus).toBeDefined();
      var artifact = {testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED'};
      // TODO is the implementation ok? I'm not referring to these cases because they're default - I get it for free from my other definitions
      expect(postPlayUtils.getArtifactStatus(artifact)).toEqual('PASSED');
//      var artifact = {testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_INCONCLUSIVE'};
//      expect(postPlayUtils.getArtifactStatus(artifact)).not.toEqual('PASSED');
    });
    it('should return \'FAILED\' if the testStatusEnum or analysisResultEnum have failed', function () {
      var artifact = {testStatusEnum: 'STATUS_COMPLETED_WITH_ERRORS', analysisResultEnum: '*'};
      expect(postPlayUtils.getArtifactStatus(artifact)).toEqual('FAILED');
      artifact = {testStatusEnum: '*', analysisResultEnum: 'TEST_FAILED'};
      expect(postPlayUtils.getArtifactStatus(artifact)).toEqual('FAILED');
    });
    it('should return \'WARNING\' if the testStatusEnum or analysisResultEnum have not completed or have completed with warnings', function () {
      var artifact = {testStatusEnum: 'INCOMPLETE', analysisResultEnum: '*'};
      expect(postPlayUtils.getArtifactStatus(artifact)).toEqual('WARNING');
      artifact = {testStatusEnum: 'STATUS_COMPLETED_WITH_WARNINGS', analysisResultEnum: '*'};
      expect(postPlayUtils.getArtifactStatus(artifact)).toEqual('WARNING');
      artifact = {testStatusEnum: '*', analysisResultEnum: 'TEST_INCONCLUSIVE'};
      expect(postPlayUtils.getArtifactStatus(artifact)).toEqual('WARNING');
      artifact = {testStatusEnum: '*', analysisResultEnum: 'TEST_NOT_ANALYSED'};
      expect(postPlayUtils.getArtifactStatus(artifact)).toEqual('WARNING');
    });
  });
  describe('statusIsFailedOrWarning', function () {
    var status;
    it('should return true if the status is \'FAILED\'', function () {
      status = 'FAILED';
      expect(postPlayUtils.statusIsFailedOrWarning(status)).toBe(true);
    });
    it('should return true if the status is \'WARNING\'', function () {
      status = 'WARNING';
      expect(postPlayUtils.statusIsFailedOrWarning(status)).toBe(true);
    });
    it('should return false if the status is \'PASSED\'', function () {
      status = 'PASSED';
      expect(postPlayUtils.statusIsFailedOrWarning(status)).toBe(false);
    });
  });
  describe('artifactsHaveSameArtifactIdAndGroupId', function () {
    var artifact1;
    var artifact2;
    it('should return true if both artifacts have same groupId and artifactId', function () {
      artifact1 = {artifactId: 'id', groupId: 'groupId'};
      artifact2 = {artifactId: 'id', groupId: 'groupId'};
      expect(postPlayUtils.artifactsHaveSameArtifactIdAndGroupId(artifact1, artifact2)).toBe(true);
    });
    it('should return false if artifacts don\'t have the same artifactId', function () {
      artifact1 = {artifactId: 'id1', groupId: 'groupId'};
      artifact2 = {artifactId: 'id2', groupId: 'groupId'};
      expect(postPlayUtils.artifactsHaveSameArtifactIdAndGroupId(artifact1, artifact2)).toBe(false);
    });
    it('should return false if artifacts don\'t have the same groupId', function () {
      artifact1 = {artifactId: 'id', groupId: 'groupId'};
      artifact2 = {artifactId: 'id', groupId: 'anotherGroupId'};
      expect(postPlayUtils.artifactsHaveSameArtifactIdAndGroupId(artifact1, artifact2)).toBe(false);
    });
  });
  describe('getFailedAndNotFailedArtifactsObject', function () {
    it('should return an object with empty arrays for failed and for all artifacts', function () {
      expect(postPlayUtils.getFailedAndNotFailedArtifactsObject([])).toEqual({passing: [], failing: []});
    });
    it('should recognize when there\'s a non failed artifact', function () {
      var passedArtifact = aPassedArtifact();

      var passedArtifactWithStatus = _.clone(passedArtifact);
      passedArtifactWithStatus.status = 'PASSED';
      expect(postPlayUtils.getFailedAndNotFailedArtifactsObject([passedArtifact])).toEqual({passing: [passedArtifactWithStatus], failing: []});
    });
    it('should recognize when there\'s a failed artifact and add the status', function () {
      var failedArtifact = aFailedArtifact();

      var failedArtifactWithStatus = _.clone(failedArtifact);
      failedArtifactWithStatus.status = 'FAILED';
      expect(postPlayUtils.getFailedAndNotFailedArtifactsObject([failedArtifact])).toEqual({passing: [], failing: [failedArtifactWithStatus]});
    });
    it('should recognize all failed and non failed artifacts', function () {
      var failedArtifact1 = aFailedArtifact();
      var failedArtifact1WithStatus = _.clone(failedArtifact1);
      failedArtifact1WithStatus.status = 'FAILED';
      var failedArtifact2 = aFailedArtifact();
      var failedArtifact2WithStatus = _.clone(failedArtifact2);
      failedArtifact2WithStatus.status = 'FAILED';
      var failedArtifact3 = aFailedArtifact();
      var failedArtifact3WithStatus = _.clone(failedArtifact3);
      failedArtifact3WithStatus.status = 'FAILED';

      var passedArtifact1 = aPassedArtifact();
      var passedArtifact1WithStatus = _.clone(passedArtifact1);
      passedArtifact1WithStatus.status = 'PASSED';
      var passedArtifact2 = aPassedArtifact();
      var passedArtifact2WithStatus = _.clone(passedArtifact2);
      passedArtifact2WithStatus.status = 'PASSED';
      var artifactsOfAllKinds = [failedArtifact1, passedArtifact1, failedArtifact2, failedArtifact3, passedArtifact2];

      expect(postPlayUtils.getFailedAndNotFailedArtifactsObject(artifactsOfAllKinds)).toEqual({
        passing: [passedArtifact1WithStatus, passedArtifact2WithStatus],
        failing: [failedArtifact1WithStatus, failedArtifact2WithStatus, failedArtifact3WithStatus]
      });
    });
  });
});
