const getPadLengthSpec = require('../../src/utils/get-pad-length');
const { expect } = require('../../../test/tools');

describe('getPadLengthSpec()', () => {
  it('should', () => {
    expect(getPadLengthSpec({ test: 'test', test12zejflzkejflz: 'test', te: 'test' })).to.eq(19);
  });
});
