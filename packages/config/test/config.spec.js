const path = require('path');
const { expect, Sinon } = require('../../test/tools');
const Config = require('../src/config');

const config = new Config();

describe('Config', () => {
  describe('has()', () => {
    it('should return true', () => expect(config.has('siteUrl')).to.be.true);
    it('should return false', () => expect(config.has('siteUrl2')).to.be.false);
  });

  describe('get()', () => {
    it('should return the right path from <outputDir>', () => {
      expect(path.normalize(config.get('outputDir'))).to.equal(path.normalize(path.join(process.cwd(), 'build')));
    });
  });

  describe('set()', () => {
    before(() => {
      config.set('outputDir', config.get('outputDir'));
    });
    it('should set value', () => {
      expect(path.normalize(config.get('outputDir'))).to.equal(path.normalize(path.join(process.cwd(), 'build')));
    });
  });

  describe('resolve()', () => {
    it('should resolve object', () => {
      expect(config.resolve({ test: '<rootDir>', t: ['<rootDir>'], t2: 1 })).to.deep.equal({
        test: path.normalize(process.cwd()),
        t: [path.normalize(process.cwd())],
        t2: 1
      });
    });

    it('should return the right path from <rootDir>', () => {
      expect(path.normalize(config.resolve('<rootDir>'))).to.equal(path.normalize(process.cwd()));
    });

    it('should return the right path from <instanceDir>', () => {
      expect(path.normalize(config.resolve('<instanceDir>'))).to.equal(path.normalize(path.join(process.cwd(), 'build')));
    });

    it('should return the right path from <websiteDir>', () => {
      expect(path.normalize(config.resolve('<websiteDir>'))).to.equal(path.normalize(path.join(process.cwd(), 'build', 'Website')));
    });

    it('should return the right path from <themesDir>', () => {
      expect(path.normalize(config.resolve('<themesDir>'))).to.equal(
        path.normalize(path.join(process.cwd(), 'build', 'Website', 'themes'))
      );
    });

    it('should return the right path from <srcDir>', () => {
      expect(path.normalize(config.resolve('<srcDir>'))).to.equal(path.normalize(path.join(process.cwd(), 'src')));
    });

    it('should return the right path from <projectDir>', () => {
      expect(path.normalize(config.resolve('<projectDir>'))).to.equal(path.normalize(path.join(process.cwd(), 'src', 'Project')));
    });

    it('should return the right path from <featureDir>', () => {
      expect(path.normalize(config.resolve('<featureDir>'))).to.equal(path.normalize(path.join(process.cwd(), 'src', 'Feature')));
    });

    it('should return the right path from <foundationDir>', () => {
      expect(path.normalize(config.resolve('<foundationDir>'))).to.equal(path.normalize(path.join(process.cwd(), 'src', 'Foundation')));
    });

    // it('should return the right path from <currentDir>', () => {
    //   expect(config.resolve('<currentDir>')).to.equal(path.join(process.cwd(), 'src', 'Project', 'Common', 'code'));
    // });
  });

  describe('definePlaceholder', () => {
    before(() => {
      config.definePlaceholder('testPattern', () => 'test');
    });

    it('should add a new method', () => {
      expect(config.resolve('<testPattern>')).to.eq('test');
    });
  });

  describe('defineGetter', () => {
    before(() => {
      config.defineGetter('test', () => 'test');
    });

    it('should add a new method', () => {
      expect(config.test).to.eq('test');
    });
  });

  describe('defineGetter', () => {
    before(() => {
      config.defineMethod('testMethod', () => 'test');
    });

    it('should add a new method', () => {
      expect(config.testMethod()).to.eq('test');
    });
  });

  describe('save()', () => {
    before(() => {
      this.nconfSaveStub = Sinon.stub(config.nconf, 'save');

      config.save();
    });

    after(() => {
      this.nconfSaveStub.restore();
    });

    it('should write the configuration', () => {
      this.nconfSaveStub.should.have.been.calledWithExactly();
    });
  });

  describe('create()', () => {
    before(() => {
      this.nconfSaveStub = Sinon.stub(config.nconf, 'save');

      config.create();
    });

    after(() => {
      this.nconfSaveStub.restore();
    });

    it('should write the configuration', () => {
      this.nconfSaveStub.should.have.been.calledWithExactly();
    });
  });

  describe('toRel()', () => {
    it('should return relative path', () => {
      expect(config.toRel(config.srcDir)).to.eq('src');
    });
  });

  describe('keys()', () => {
    it('should return the list of keys', () => {
      expect(config.keys()).to.be.an('array');
    });
  });

  describe('toObject()', () => {
    it('should return a plain object with resolved configuration', () => {
      expect(config.toObject()).to.be.an('object');
    });
  });

  describe('property', () => {
    before(() => {
      const instanceRoot = config.get('instanceRoot');
      config.set('instanceRoot', instanceRoot);
    });
    it('should return currentWebsite', () => {
      expect(config.currentWebsite).to.eq('Common');
    });

    it('should return siteUrl', () => {
      expect(config.siteUrl).to.eq('https://base.dev.local');
    });

    it('should return authConfigFile', () => {
      expect(path.normalize(config.authConfigFile)).to.contains(
        path.normalize('build/Website/App_config/Include/Unicorn/Unicorn.UI.config')
      );
    });

    it('should return authConfigFile', () => {
      expect(path.normalize(config.authConfigFilePath)).to.contains(
        path.normalize('build/Website/App_config/Include/Unicorn/Unicorn.UI.config')
      );
    });

    it('should return rootDir', () => {
      expect(path.normalize(config.rootDir)).to.contains('');
    });

    it('should return instanceRoot', () => {
      expect(path.normalize(config.instanceRoot)).to.contains(path.normalize('/build'));
    });

    it('should return websiteRoot', () => {
      expect(path.normalize(config.websiteRoot)).to.contains(path.normalize('build/Website'));
    });

    it('should return themeWebsiteRoot', () => {
      expect(path.normalize(config.themeWebsiteRoot)).to.contains(path.normalize('build/Website/themes'));
    });

    it('should return currentWebsiteRoot', () => {
      expect(path.normalize(config.currentWebsiteRoot)).to.contains(path.normalize('build/Website/themes/Common'));
    });

    it('should return sitecoreLibraries', () => {
      expect(path.normalize(config.sitecoreLibrariesRoot)).to.contains(path.normalize('build/Website/bin'));
    });

    it('should return licensePath', () => {
      expect(path.normalize(config.licensePath)).to.contains(path.normalize('build/Data/license.xml'));
    });

    it('should return solutionPath', () => {
      expect(path.normalize(config.solutionPath)).to.contains(path.normalize(path.join(process.cwd(), 'Base.sln')));
    });

    it('should return websiteViewsRoot', () => {
      expect(path.normalize(config.websiteViewsRoot)).to.contains(path.normalize('build/Website/Views'));
    });

    it('should return websiteConfigRoot', () => {
      expect(path.normalize(config.websiteConfigRoot)).to.equal(path.normalize(path.join(process.cwd(), 'build/Website/App_Config')));
    });

    it('should return srcRoot', () => {
      expect(path.normalize(config.srcRoot)).to.equal(path.normalize(path.join(process.cwd(), 'src')));
    });

    it('should return foundationRoot', () => {
      expect(path.normalize(config.foundationRoot)).to.equal(path.normalize(path.join(process.cwd(), 'src/Foundation')));
    });

    it('should return foundationScriptsRoot', () => {
      expect(path.normalize(config.foundationScriptsRoot)).to.contains(path.normalize('src/Foundation/Core/code/Scripts'));
    });

    it('should return featureRoot', () => {
      expect(path.normalize(config.featureRoot)).to.equal(path.normalize(path.join(process.cwd(), 'src/Feature')));
    });

    it('should return projectRoot', () => {
      expect(path.normalize(config.projectRoot)).to.contains(path.normalize(path.join(process.cwd(), 'src/Project')));
    });

    it('should return publishPaths', () => {
      expect(config.publishPaths).to.deep.equal([path.normalize(config.solutionPath)]);
    });

    it('should return buildPaths', () => {
      expect(config.buildPaths).to.deep.equal([path.normalize(config.solutionPath)]);
    });

    it('should return currentProjectRoot', () => {
      expect(path.normalize(config.currentProjectRoot)).to.equal(path.normalize(path.join(process.cwd(), 'src/Project/Common/code')));
    });

    // it('should return directories', () => {
    //   expect(config.directories).to.deep.eq({
    //     buildDirectory: './build',
    //     featureDirectory: './src/Feature',
    //     featureRoot: './src/Feature',
    //     foundationDirectory: './src/Foundation',
    //     projectDirectory: './src/Project',
    //     projectRoot: './src/Project',
    //     src: './src',
    //     themeBuildDirectory: './build/Website/themes'
    //   });
    // });

    // it('should return bundle', () => {
    //   expect(config.bundle).to.deep.eq({
    //     bundleName: 'bundle',
    //     polyfills: 'polyfills',
    //     styleguide: 'styleguide'
    //   });
    // });
    //
    // it('should return bundles', () => {
    //   expect(config.bundles).to.deep.eq({
    //     bundleName: 'bundle',
    //     polyfills: 'polyfills',
    //     styleguide: 'styleguide'
    //   });
    // });

    // it('should return moduleNameMapper object', () => {
    //   expect(config.moduleNameMapper).to.deep.eq({
    //     '^@/(.*)$': '<rootDir>/src/$1',
    //     '^@Feature(.*)$': '<rootDir>/src/Feature$1',
    //     '^@Foundation(.*)$': '<rootDir>/src/Foundation/Core/code/Scripts$1',
    //     '^@Master(.*)$': '<rootDir>/src/Project/Common/code$1',
    //     '^@Project(.*)$': '<rootDir>/src/Project$1'
    //   });
    // });

    // describe('pushProxyUrl()', () => {
    //   before(() => {
    //     this.nconfSaveStub = Sinon.stub(config.nconf, 'save');
    //
    //     config.pushProxyUrl('https://test.fr');
    //     config.pushProxyUrl('https://test.fr');
    //   });
    //
    //   after(() => {
    //     this.nconfSaveStub.restore();
    //   });
    //
    //   it('should write the configuration', () => {
    //     this.nconfSaveStub.should.have.been.calledWithExactly();
    //   });
    // });

    // describe('proxyUrls', () => {
    //   before(() => {
    //     config.set('proxyUrls', ['test']);
    //   });
    //   it('should return proxyUrls', () => {
    //     expect(config.proxyUrls).to.deep.eq(['test']);
    //   });
    // });
  });
});
