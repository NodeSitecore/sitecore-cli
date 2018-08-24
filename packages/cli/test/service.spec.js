const fs = require('fs-extra');
const readPkg = require('read-pkg');
const commander = require('commander');
const config = require('@node-sitecore/config');
const proxyquire = require('proxyquire');
const { expect, Sinon } = require('../../test/tools');
const PluginAPI = require('../src/plugin-api');

const CliService = proxyquire('../src/service', {
  '@node-sitecore/cli-plugin-browsersync': { cliBrowserSync: 'test' },
  '@node-sitecore/cli-plugin-vue': { cliBrowserVue: 'test' },
  './commands/init': {},
  './commands/build': {},
  './commands/nuget': {},
  './commands/publish': {},
  './commands/restore': {},
  './commands/ps': {},
  './commands/run': {},
  './commands/unicorn': {},
  './commands/inspect': {}
});

describe('Cli Service', () => {
  before(() => {
    Sinon.stub(CliService.prototype, 'resolvePlugins').returns(['plugins']);
    Sinon.stub(CliService.prototype, 'resolvePkg').returns({ version: '1.0.0' });
    Sinon.stub(CliService.prototype, 'init');

    this.service = new CliService(process.cwd(), {
      pkg: {
        devDependencies: {
          '@node-sitecore/cli-plugin-browsersync': '*'
        }
      }
    });
  });

  it('should call resolvePkg()', () => {
    this.service.resolvePkg.should.have.been.calledWithExactly({
      devDependencies: {
        '@node-sitecore/cli-plugin-browsersync': '*'
      }
    });
  });

  it('should call resolvePlugins()', () => {
    this.service.resolvePlugins.should.have.been.calledWithExactly();
  });

  it('should call init()', () => {
    this.service.init.should.have.been.calledWithExactly();
  });

  it('should store current Service in process.NSC_CLI_SERVICE', () => {
    expect(process.NSC_CLI_SERVICE).to.equal(this.service);
  });

  it('should store context', () => {
    expect(this.service.context).to.equal(process.cwd());
  });

  it('should init commands', () => {
    expect(this.service.commands).to.deep.equal({});
  });

  it('should init pkg', () => {
    expect(this.service.pkg).to.deep.equal({ version: '1.0.0' });
  });

  it('should init plugins', () => {
    expect(this.service.plugins).to.deep.equal(['plugins']);
  });

  describe('resolvePkg()', () => {
    before(() => {
      CliService.prototype.resolvePkg.restore();
    });

    describe('when inline pkg is given', () => {
      it('should return pkg', () => {
        expect(this.service.resolvePkg({ package: 'test' })).to.deep.eq({ package: 'test' });
      });
    });

    describe('when package is resolved with fs.existsSync()', () => {
      before(() => {
        Sinon.stub(fs, 'existsSync').returns(true);
        Sinon.stub(readPkg, 'sync').returns({ package: 'test' });
      });

      after(() => {
        fs.existsSync.restore();
        readPkg.sync.restore();
      });

      it('should return pkg', () => {
        expect(this.service.resolvePkg()).to.deep.eq({ package: 'test' });
      });
    });

    describe('when package is not resolved with fs.existsSync()', () => {
      before(() => {
        Sinon.stub(fs, 'existsSync').returns(false);
        Sinon.stub(readPkg, 'sync').returns({ package: 'test' });
      });

      after(() => {
        fs.existsSync.restore();
        readPkg.sync.restore();
      });

      it('should return pkg', () => {
        expect(this.service.resolvePkg()).to.deep.eq({});
      });
    });
  });

  describe('init()', () => {
    before(() => {
      CliService.prototype.init.restore();

      this.applyStub = Sinon.stub();

      this.service.plugins = [{ id: 'id', apply: this.applyStub }];

      this.service.init();
      this.service.init();
    });

    it('should call PluginApi and apply()', () => {
      this.applyStub.should.have.been.calledOnce.and.calledWithExactly(Sinon.match.instanceOf(PluginAPI), config);
    });
  });

  describe('resolvePlugins()', () => {
    before(done => {
      CliService.prototype.resolvePlugins.restore();

      this.service.pkg = {
        devDependencies: {
          '@node-sitecore/cli-plugin-browsersync': '*'
        },
        dependencies: {
          '@node-sitecore/cli-plugin-vue': '*'
        }
      };
      this.result = this.service.resolvePlugins();

      done();
    });

    it('should load plugins', () => {
      expect(this.result).to.deep.equal([
        {
          apply: {},
          id: 'built-in:commands/init'
        },
        {
          apply: {},
          id: 'built-in:commands/build'
        },
        {
          apply: {},
          id: 'built-in:commands/nuget'
        },
        {
          apply: {},
          id: 'built-in:commands/publish'
        },
        {
          apply: {},
          id: 'built-in:commands/restore'
        },
        {
          apply: {},
          id: 'built-in:commands/ps'
        },
        {
          apply: {},
          id: 'built-in:commands/run'
        },
        {
          apply: {},
          id: 'built-in:commands/unicorn'
        },
        {
          apply: {},
          id: 'built-in:commands/inspect'
        },
        {
          apply: {
            cliBrowserSync: 'test'
          },
          id: '@node-sitecore/cli-plugin-browsersync'
        },
        {
          apply: {
            cliBrowserVue: 'test'
          },
          id: '@node-sitecore/cli-plugin-vue'
        }
      ]);
    });
  });

  describe('run()', () => {
    describe('when name is not given', () => {
      before(() => {
        this.service.commands = {
          test: {
            opts: {
              description: ''
            }
          }
        };
        Sinon.stub(console, 'log');
        this.service.run();
      });

      after(() => {
        console.log.restore();
      });

      it('should print helper', () => console.log.should.have.been.called);
    });

    describe('when name is given', () => {
      before(() => {
        this.fnStub = Sinon.stub();
        this.service.commands = {
          test: {
            fn: this.fnStub,
            opts: {
              usage: 'usage',
              description: 'description',
              arguments: 'arguments',
              options: {
                '-o': {
                  type: String,
                  description: 'description options'
                }
              }
            }
          }
        };

        Sinon.stub(commander, 'option');
        Sinon.stub(commander, 'version');
        Sinon.stub(commander, 'usage');
        Sinon.stub(commander, 'arguments');
        Sinon.stub(commander, 'parse');

        commander.args = ['test', 'other'];

        return this.service.run('test');
      });

      after(() => {
        commander.option.restore();
        commander.arguments.restore();
        commander.version.restore();
        commander.usage.restore();
        commander.parse.restore();
      });

      it('should call plugin function', () => {
        this.fnStub.should.have.been.calledWithExactly(commander, ['other']);
      });

      it('should call commander.option', () => commander.option.should.have.been.calledTwice);
    });

    describe('when --help is given', () => {
      before(() => {
        this.fnStub = Sinon.stub();
        this.service.commands = {
          test: {
            fn: this.fnStub,
            opts: {}
          }
        };

        Sinon.stub(commander, 'option');
        Sinon.stub(commander, 'version');
        Sinon.stub(commander, 'arguments');
        Sinon.stub(commander, 'usage');
        Sinon.stub(commander, 'parse');
        Sinon.stub(commander, 'outputHelp');

        this.argv = process.argv;
        process.argv = ['test', 'other', '--help'];

        return this.service.run('test');
      });

      after(() => {
        process.argv = this.argv;
        commander.option.restore();
        commander.version.restore();
        commander.arguments.restore();
        commander.usage.restore();
        commander.parse.restore();
        commander.outputHelp.restore();
      });

      it('should call commander.option', () => commander.outputHelp.should.have.been.called);
    });

    describe('when type === raw is given', () => {
      before(() => {
        this.fnStub = Sinon.stub();
        this.service.commands = {
          test: {
            fn: this.fnStub,
            opts: {
              type: 'raw'
            }
          }
        };

        return this.service.run('test');
      });

      it('should call plugin function', () => {
        this.fnStub.should.have.been.calledWithExactly({ args: [], command: null });
      });
    });
  });
});
