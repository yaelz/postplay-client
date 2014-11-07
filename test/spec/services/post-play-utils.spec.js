'use strict';

describe('Service: postPlayUtils', function () {

  // load the service's module
  beforeEach(function () {
    module('postplayTryAppInternal');

    //add your mocks here
  });

  // instantiate service
  var postPlayUtils;
  beforeEach(inject(function (_postPlayUtils_) {
    postPlayUtils = _postPlayUtils_;
  }));

  it('should be able to filter an object from an array (with deep equality check)', function () {
    var array = [{a: 1, b: 2, c: []}, {whiz: 'kid'}];
    var filteredArray = postPlayUtils.filter(array, {whiz: 'kid'});
    expect(filteredArray).toEqual([{a: 1, b: 2, c: []}]);
  });

});
