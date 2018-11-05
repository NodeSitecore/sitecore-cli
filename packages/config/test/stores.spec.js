const path = require('path');
const fs = require('fs-extra');
const Stores = require('../src/stores');
const { Sinon, expect } = require('../../test/tools');

describe('Stores', () => {
  describe('loadStores()', () => {
    let nconf, argvStub, result;

    before(() => {
      argvStub = { env: Sinon.stub() };
      nconf = {
        argv: Sinon.stub().returns(argvStub),
        get: Sinon.stub(),
        add: Sinon.stub(),
        file: Sinon.stub(),
        defaults: Sinon.stub()
      };

      nconf.get.withArgs('configPath').returns(false);
      nconf.get.withArgs('rootDir').returns('rootDir');

      Sinon.stub(Stores, 'resolveStores').returns([
        { type: 'literal', scope: 'current', store: 'store', file: '/path/to/current' },
        { type: 'file', scope: 'scopeFile', file: '/path/to' },
        { type: 'other', scope: 'scopeFile', file: '/path/to' }
      ]);

      result = Stores.loadStores(nconf, { default: 'default' });
    });
    after(() => {
      Stores.resolveStores.restore();
    });

    it('should called argv and configure env parser', () => {
      nconf.argv.should.have.been.calledWithExactly();
      argvStub.env.should.have.been.calledWithExactly({ separator: '__' });
    });

    it('should load configuration', () => {
      nconf.add.should.have.been.calledWithExactly('current', { type: 'literal', store: 'store' });
      nconf.file.should.have.been.calledWithExactly('scopeFile', { file: '/path/to' });
    });

    it('should load defaults configuration', () => {
      nconf.defaults.should.have.been.calledWithExactly({ default: 'default' });
    });
    it('should return data', () => {
      expect(result).to.deep.eq({
        rootDir: 'rootDir',
        configPath: '/path/to/current'
      });
    });
  });
  describe('whenResolveStore()', () => {
    let acc, store, cwd, result;

    before(() => {
      acc = [];
      store = {
        file: '.nscrc'
      };
      cwd = '/path/to';

      Sinon.stub(Stores, 'readConfiguration');
      Sinon.spy(Stores, 'whenResolveStore');

      Stores.readConfiguration.onCall(0).returns({
        store: {
          extends: '../project/.nscrc'
        }
      });

      Stores.readConfiguration.onCall(1).returns(false);

      Sinon.stub(Stores, 'getConfigurationInfo').returns({
        dirname: '/to/dirname',
        file: '.nscrc',
        scope: 'scope'
      });

      result = Stores.whenResolveStore(acc, store, cwd);
    });
    after(() => {
      Stores.readConfiguration.restore();
      Stores.getConfigurationInfo.restore();
    });

    it('should called readConfiguration', () => {
      Stores.readConfiguration.should.have.been.calledWithExactly(store, cwd);
    });

    it('should called getConfigurationInfo', () => {
      Stores.getConfigurationInfo.should.have.been.calledWithExactly('../project/.nscrc');
    });

    it('should called whenResolveStore', () => {
      Stores.whenResolveStore.should.have.been.calledWithExactly(
        [],
        {
          file: '.nscrc',
          scope: 'scope'
        },
        path.join(cwd, '/to/dirname')
      );
    });
    it('should return a list of store', () => {
      expect(result).to.deep.eq([
        {
          store: {
            extends: 'scope'
          }
        }
      ]);
    });
  });

  describe('getConfigurationInfo()', () => {
    it('should return information', () => {
      expect(Stores.getConfigurationInfo('/to/dirname/.nscrc')).to.deep.eq({
        dirname: '/to/dirname',
        file: '.nscrc',
        scope: 'dirname'
      });
    });
  });

  describe('readConfiguration()', () => {
    describe('when file does not exists', () => {
      let store, result;

      before(() => {
        store = {};
        Sinon.stub(fs, 'existsSync');

        fs.existsSync.withArgs('/cwd/path/to/.nscrc').returns(false);

        Sinon.stub(Stores, 'resolveFileName').returns('/cwd/path/to/.nscrc');
        Sinon.stub(Stores, 'readJson');
        Sinon.stub(Stores, 'requireFile');

        result = Stores.readConfiguration(store, 'cwd');
      });

      after(() => {
        fs.existsSync.restore();
        Stores.resolveFileName.restore();
        Stores.readJson.restore();
        Stores.requireFile.restore();
      });
      it('should return false', () => {
        expect(result).to.eq(false);
      });
    });

    describe('when file exists without extension', () => {
      let store, result;

      before(() => {
        store = {
          file: 'path/to/.nscrc'
        };
        Sinon.stub(fs, 'existsSync');

        fs.existsSync.withArgs('/cwd/path/to/.nscrc').returns(true);

        Sinon.stub(Stores, 'resolveFileName').returns('/cwd/path/to/.nscrc');
        Sinon.stub(Stores, 'readJson').returns({ store: 'store' });
        Sinon.stub(Stores, 'requireFile');

        result = Stores.readConfiguration(store, 'cwd');
      });

      after(() => {
        fs.existsSync.restore();
        Stores.resolveFileName.restore();
        Stores.readJson.restore();
        Stores.requireFile.restore();
      });
      it('should called resolveFileName', () => {
        Stores.resolveFileName.should.have.been.calledWithExactly('path/to/.nscrc', 'cwd');
      });

      it('should called readJson', () => {
        Stores.readJson.should.have.been.calledWithExactly('/cwd/path/to/.nscrc', store);
      });
      it('should return store', () => {
        expect(result).to.deep.eq({ store: 'store' });
      });
    });
    describe('when file exists with json extension', () => {
      let store, result;

      before(() => {
        store = {
          file: 'path/to/.nscrc'
        };
        Sinon.stub(fs, 'existsSync');

        fs.existsSync.withArgs('/cwd/path/to/.nscrc.json').returns(true);

        Sinon.stub(Stores, 'resolveFileName').returns('/cwd/path/to/.nscrc');
        Sinon.stub(Stores, 'readJson').returns({ store: 'store' });
        Sinon.stub(Stores, 'requireFile');

        result = Stores.readConfiguration(store, 'cwd');
      });

      after(() => {
        fs.existsSync.restore();
        Stores.resolveFileName.restore();
        Stores.readJson.restore();
        Stores.requireFile.restore();
      });
      it('should called resolveFileName', () => {
        Stores.resolveFileName.should.have.been.calledWithExactly('path/to/.nscrc', 'cwd');
      });

      it('should called readJson', () => {
        Stores.readJson.should.have.been.calledWithExactly('/cwd/path/to/.nscrc.json', store);
      });
      it('should return store', () => {
        expect(result).to.deep.eq({ store: 'store' });
      });
    });
    describe('when file exists with js extension', () => {
      let store, result;

      before(() => {
        store = {
          file: 'path/to/.nscrc'
        };
        Sinon.stub(fs, 'existsSync');

        fs.existsSync.withArgs('/cwd/path/to/.nscrc.js').returns(true);

        Sinon.stub(Stores, 'resolveFileName').returns('/cwd/path/to/.nscrc');
        Sinon.stub(Stores, 'readJson');
        Sinon.stub(Stores, 'requireFile').returns({ store: 'store' });

        result = Stores.readConfiguration(store, 'cwd');
      });

      after(() => {
        fs.existsSync.restore();
        Stores.resolveFileName.restore();
        Stores.readJson.restore();
        Stores.requireFile.restore();
      });
      it('should called resolveFileName', () => {
        Stores.resolveFileName.should.have.been.calledWithExactly('path/to/.nscrc', 'cwd');
      });

      it('should called readJson', () => {
        Stores.requireFile.should.have.been.calledWithExactly('/cwd/path/to/.nscrc.js', store);
      });
      it('should return false', () => {
        expect(result).to.deep.eq({ store: 'store' });
      });
    });
  });

  describe('resolveFileName()', () => {
    it('should resolveFileName', () => {
      expect(Stores.resolveFileName('./nscrc', '/cwd')).to.eq('/cwd/nscrc');
      expect(Stores.resolveFileName('ab/nscrc', '/cwd')).to.eq('/cwd/ab/nscrc');
    });
  });

  describe('requireFile()', () => {
    it('should return store configuration', () => {
      expect(Stores.requireFile(`${__dirname}/data/store.js`, {})).to.deep.eq({
        file: `${__dirname}/data/store.js`,
        store: {
          data: 'data',
          rootDir: path.dirname(`${__dirname}/data/store.js`)
        },
        type: 'literal'
      });
    });
  });

  describe('readJson()', () => {
    it('should return store configuration', () => {
      expect(Stores.readJson(`${__dirname}/data/store.json`, {})).to.deep.eq({
        file: `${__dirname}/data/store.json`,
        store: {
          data: 'data',
          rootDir: path.dirname(`${__dirname}/data/store.json`)
        },
        type: 'literal'
      });
    });

    it('should return store configuration', () => {
      expect(Stores.readJson(`${__dirname}/data/.store`, {})).to.deep.eq({
        file: `${__dirname}/data/.store`,
        store: {
          data: 'data',
          rootDir: path.dirname(`${__dirname}/data/.store`)
        },
        type: 'literal'
      });
    });
  });
});
