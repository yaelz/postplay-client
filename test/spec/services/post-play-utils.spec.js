'use strict';

/*global localStorage: false */
describe('Service: postPlayUtils', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    var store = [];
    //add your mocks here
    spyOn(localStorage, 'getItem').andCallFake(function (key) {
      return store[key];
    });
    spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
      store[key] = value + '';
      return store[key];
    });
  });

  function aFailedArtifact() {
    return {analysisResultEnum: 'TEST_FAILED'};
  }

  function aPassedArtifact() {
    return {testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY', analysisResultEnum: 'TEST_PASSED'};
  }

  function addStatusToArtifact(artifact) {
    var newArtifact = _.clone(artifact);
    var status = postPlayUtils.getArtifactStatus(newArtifact);
    newArtifact.status = status;
    return newArtifact;
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
  describe('getFailedAndFavouriteArtifactsObject', function () {
    it('should return an object with empty arrays for failed and for all artifacts', function () {
      expect(postPlayUtils.getFailedAndFavouriteAndPassedArtifactsObject([])).toEqual({passing: [], failing: []});
    });
    it('should recognize when there\'s a non failed artifact', function () {
      var passedArtifact = aPassedArtifact();

      var passedArtifactWithStatus = addStatusToArtifact(passedArtifact);
      expect(postPlayUtils.getFailedAndFavouriteAndPassedArtifactsObject([passedArtifact])).toEqual({passing: [passedArtifactWithStatus], failing: []});
    });
    it('should failed artifact and add the status', function () {
      var failedArtifact = aFailedArtifact();

      var failedArtifactWithStatus = _.clone(failedArtifact);
      failedArtifactWithStatus.status = 'FAILED';
      expect(postPlayUtils.getFailedAndFavouriteAndPassedArtifactsObject([failedArtifact])).toEqual({passing: [], failing: [failedArtifactWithStatus]});
    });
    it('should recognize all failed and non failed artifacts', function () {
      var failedArtifact1 = aFailedArtifact();
      var failedArtifact1WithStatus = addStatusToArtifact(failedArtifact1);

      var passedArtifact1 = aPassedArtifact();
      var passedArtifact1WithStatus = addStatusToArtifact(passedArtifact1);
      var artifactsOfAllKinds = [failedArtifact1, passedArtifact1];

      expect(postPlayUtils.getFailedAndFavouriteAndPassedArtifactsObject(artifactsOfAllKinds)).toEqual({passing: [passedArtifact1WithStatus], failing: [failedArtifact1WithStatus]});
    });
    it('should insert a passed artifact to the failed and chosen if it\'s save in the localStorage', function () {
      var failedArtifact1 = aFailedArtifact();
      var failedArtifact1WithStatus = addStatusToArtifact(failedArtifact1);

      var passedArtifact1 = aPassedArtifact();
      passedArtifact1.artifactId = 'passed_1';
      var passedArtifact1WithStatus = addStatusToArtifact(passedArtifact1);
      var artifactsOfAllKinds = [failedArtifact1, passedArtifact1];
      localStorage.setItem('passed_1', true);
      expect(postPlayUtils.getFailedAndFavouriteAndPassedArtifactsObject(artifactsOfAllKinds)).toEqual({passing: [], failing: [passedArtifact1WithStatus, failedArtifact1WithStatus]});
    });
  });
});
