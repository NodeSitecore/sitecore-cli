const fs = require('fs');
const { expect, Sinon } = require('../tools');
const config = require('../../src/config');
const formatPath = require('../../src/format-path');

describe('Config', () => {
  describe('has()', () => {
    it('should return true', () => {
      return expect(config.has('siteUrl')).to.be.true;
    });

    it('should return false', () => {
      return expect(config.has('siteUrl2')).to.be.false;
    });
  });

  describe('readConfiguration()', () => {
    before(() => {
      this.hasConfigurationStub = Sinon.stub(config, 'hasConfiguration').returns(true);
      this.setStub = Sinon.stub(config, 'set');
      this.readFileSyncStub = Sinon.stub(fs, 'readFileSync').returns('{"key1": "value"}');

      config.readConfiguration();
    });

    after(() => {
      this.hasConfigurationStub.restore();
      this.readFileSyncStub.restore();
      this.setStub.restore();
    });

    it('should verify if the file exists', () => {
      return this.hasConfigurationStub.should.have.been.called;
    });
    it('should read the .nscrc file', () => {
      this.readFileSyncStub.should.have.been.calledWithExactly(Sinon.match(formatPath('.nscrc')), 'utf8');
    });

    it('should load keys and values', () => {
      this.setStub();
    });
  });

  describe('readDevConfiguration()', () => {
    before(() => {
      this.hasDevConfigurationStub = Sinon.stub(config, 'hasDevConfiguration').returns(true);
      this.setStub = Sinon.stub(config, 'set');
      this.readFileSyncStub = Sinon.stub(fs, 'readFileSync').returns('{"key1": "value"}');

      config.readDevConfiguration();
    });

    after(() => {
      this.hasDevConfigurationStub.restore();
      this.readFileSyncStub.restore();
      this.setStub.restore();
    });

    it('should verify if the file exists', () => {
      return this.hasDevConfigurationStub.should.have.been.called;
    });
    it('should read the .nscrc file', () => {
      this.readFileSyncStub.should.have.been.calledWithExactly(Sinon.match(formatPath('.development.nscrc')), 'utf8');
    });

    it('should load keys and values', () => {
      this.setStub();
    });
  });

  describe('writeConfiguration()', () => {
    before(() => {
      this.writeFileSyncStub = Sinon.stub(fs, 'writeFileSync');
      this.map = config._config;
      config._config = new Map();
      config._config.set('key1', 'value1');

      config.writeConfiguration();
    });

    after(() => {
      config._config = this.map;
      this.writeFileSyncStub.restore();
    });

    it('should write the configuration', () => {
      this.writeFileSyncStub.should.have.been.calledWithExactly(
        Sinon.match('.nscrc'),
        JSON.stringify({ key1: 'value1' }, null, 2),
        { encoding: 'utf8' }
      );
    });
  });


  describe('property', () => {
    it('should return siteUrl', () => {
      expect(config.siteUrl).to.eq('http://base.dev.local');
    });

    it('should return authConfigFile', () => {
      expect(config.authConfigFile).to.contains(formatPath('build/Website/App_config/Include/Unicorn/Unicorn.UI.config'));
    });

    it('should return websiteRoot', () => {
      expect(config.websiteRoot).to.contains(formatPath('build/Website'));
    });

    it('should return sitecoreLibraries', () => {
      expect(config.sitecoreLibraries).to.contains(formatPath('build/Website/bin'));
    });

    it('should return licensePath', () => {
      expect(config.licensePath).to.contains(formatPath('build/Data/license.xml'));
    });

    it('should return solutionPath', () => {
      expect(config.solutionPath).to.contains(formatPath('./ScProject.sln'));
    });

    it('should return projectRoot', () => {
      expect(config.projectRoot).to.contains(formatPath('./src'));
    });

    it('should return websiteViewsPath', () => {
      expect(config.websiteViewsPath).to.contains(formatPath('build/Website/Views'));
    });

    it('should return websiteConfigPath', () => {
      expect(config.websiteConfigPath).to.contains(formatPath('build/Website/App_Config'));
    });
  });
});