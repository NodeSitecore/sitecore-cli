const path = require('path');
const PluginAPI = require('../src/plugin-api');

const { expect } = require('../../test/tools');

describe('Cli Service', () => {
  before(() => {
    this.service = {
      context: __dirname,
      commands: {},
      plugins: [
        {
          apply: {
            cliBrowserVue: 'test'
          },
          id: '@node-sitecore/cli-plugin-vue'
        }
      ]
    };
    this.plugin = new PluginAPI('id', this.service);
  });

  it('should return cwd', () => {
    expect(this.plugin.getCwd()).to.eq(__dirname);
  });

  it('should return resolved path', () => {
    expect(this.plugin.resolve('plugin-api.spec.js')).to.eq(path.resolve(__dirname, 'plugin-api.spec.js'));
  });

  describe('hasPlugin', () => {
    it('should return true is the plugin exists', () => expect(this.plugin.hasPlugin('@node-sitecore/cli-plugin-vue')).to.be.true);
    it('should return false is the plugin exists', () => expect(this.plugin.hasPlugin('@node-sitecore/cli-plugin-no')).to.be.false);
  });

  describe('registerCommand()', () => {
    it('should add command', () => {
      this.plugin.registerCommand('test', {}, () => {});
      expect(this.service.commands.test).to.be.an('object');
    });
  });
});
