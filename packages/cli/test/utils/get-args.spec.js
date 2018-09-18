const getArgs = require('../../src/utils/get-args');
const { expect } = require('../../../test/tools');

describe('getArgs()', () => {
  it('should', () => {
    expect(getArgs('test', ['zefjze', 'test', 'arg1', '--option', 'o'])).to.deep.eq({
      args: ['arg1', '--option', 'o'],
      command: 'test',
      script: true
    });
  });
});
