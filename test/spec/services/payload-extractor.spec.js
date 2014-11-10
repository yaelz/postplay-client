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

  it('should extract passed artifact from payload', function () {
    var failingArtifacts = [{}];
    var payloadWithSingleArtifact = [{}];
    expect(payloadExtractor.extract(payloadWithSingleArtifact).passing).toEqual(failingArtifacts);
  });
  it();

});
