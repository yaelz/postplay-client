/**
 * Created by Yael_Zaritsky on 11/10/14.
 */
'use strict';
describe('Payload extractor', function () {
  var payloadExtractor;
  beforeEach(function () {
    module('postplayTryAppInternal');
    //add your mocks here
  });
  beforeEach(inject(function (_payloadExtractor_) {
    payloadExtractor = _payloadExtractor_;
  }));
  it('should extract empty results for empty payload', function () {
    var emptyResults = {failing: [], passing: []};
    expect(payloadExtractor.extract([])).toEqual(emptyResults);
  });
  it('should extract passed and failed artifacts from payload', function () {
    var passedArtifact = {
      artifactId: 'hotels',
      groupId: 'com.wixpress',
      artifactName: 'Wix Hotels',
      version: '1.139.0',
      event: 'TESTBED',
      runStatusEnum: 'FINISHED',
      testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY',
      analysisResultEnum: 'TEST_PASSED',
      startTime: 1414501072032
    };
    var failedArtifact = {
      artifactId: 'wix-html-editor-webapp',
      groupId: 'com.wixpress',
      artifactName: '2. Wix Html Editor',
      version: '2.490.0',
      event: 'TESTBED',
      runStatusEnum: 'FINISHED',
      testStatusEnum: 'STATUS_COMPLETED_SUCCESSFULLY',
      analysisResultEnum: 'TEST_FAILED',
      startTime: 1414501072032
    };
    var payloadWithPassedAndFailedArtifacts = [failedArtifact, passedArtifact];
    var failingArtifacts = [failedArtifact];
    var passingArtifacts = [passedArtifact];
    var artifactsFromPayloadExtractor = payloadExtractor.extract(payloadWithPassedAndFailedArtifacts);
    expect(artifactsFromPayloadExtractor.passing).toEqual(passingArtifacts);
    expect(artifactsFromPayloadExtractor.failing).toEqual(failingArtifacts);
  });
});
