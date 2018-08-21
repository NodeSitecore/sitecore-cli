const { matchesPluginId } = require('../../src/utils/plugin-resolution');
const { expect } = require('../../../test/tools');

describe('matchesPluginId()', () => {
  it('should', () => {
    expect(matchesPluginId('test', '@node-sitecore/cli-plugin-test')).to.eq(true);
  });
});
