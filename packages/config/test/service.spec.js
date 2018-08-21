const { expect } = require('../../test/tools');
const ConfigService = require('../src/service');

describe('Config Service', () => {
  before(() => {
    this.service = new ConfigService(process.cwd());
    this.service.initialized = false;
    this.service.pkg = {
      devDependencies: {
        '@node-sitecore/config-browserify': '*',
        '@node-sitecore/cli': '*'
      }
    };

    this.service.plugins = this.service.resolvePlugins();
    this.service.init();
    this.service.init();
  });

  describe('resolvePkg()', () => {
    describe('when package exists', () => {
      it('should return package.json object', () => {
        expect(this.service.resolvePkg()).to.be.an('object');
      });
    });

    describe('when package does not exists', () => {
      it('should return package.json object', () => {
        expect(this.service.resolvePkg(__dirname)).to.be.an('object');
      });
    });
  });
});
