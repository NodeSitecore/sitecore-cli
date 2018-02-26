const fs = require('fs');
const execa = require('execa');
const { expect, Sinon } = require('../tools');
const unicorn = require('../../src/unicorn');
const { writeSharedSecretKey, getUnicornSharedSecretKey, sync, formatUrl } = unicorn;

describe('Unicorn', () => {
  describe('writeSharedSecretKey()', () => {
    describe('when the shared secret didn\'t exists', () => {
      before(() => {
        this.readFileSyncStub = Sinon.stub(fs, 'readFileSync').returns('#{UnicornSecret}');
        this.writeFileSyncStub = Sinon.stub(fs, 'writeFileSync');
        writeSharedSecretKey('/dest/file.config');
      });

      after(() => {
        this.readFileSyncStub.restore();
        this.writeFileSyncStub.restore();
      });

      it('should call readFileSync method with the right parameters', () => {
        this.readFileSyncStub.should.have.been.calledWithExactly(Sinon.match('/dest/file.config'), { encoding: 'utf8' });
      });

      it('should call writeFileSync method with right parameters', () => {
        this.writeFileSyncStub.should.have.been.calledWithExactly('/dest/file.config', Sinon.match((str) => typeof str === 'string' && str !== '${}'), { encoding: 'utf8' });
      });
    });

    describe('when the shared secret exists', () => {
      before(() => {
        this.readFileSyncStub = Sinon.stub(fs, 'readFileSync').returns('EXISTS');
        this.writeFileSyncStub = Sinon.stub(fs, 'writeFileSync');
        writeSharedSecretKey('/dest/file.config');
      });

      after(() => {
        this.readFileSyncStub.restore();
        this.writeFileSyncStub.restore();
      });

      it('should call readFileSync method with the right parameters', () => {
        this.readFileSyncStub.should.have.been.calledWithExactly(Sinon.match('/dest/file.config'), { encoding: 'utf8' });
      });

      it('should not call writeFileSync method', () => {
        return this.writeFileSyncStub.should.not.have.been.called;
      });
    });

  });

  describe('getUnicornSecret()', () => {
    describe('when the shared secret config file doesn\'t exists', () => {
      before(() => {
        this.readFileSyncStub = Sinon.stub(fs, 'readFileSync').returns(`
        <configuration>
            <sitecore>
                <unicorn>
                    <authenticationProvider>
                        <SharedSecret>#{UnicornSecret}</SharedSecret>
                        <WriteAuthFailuresToLog>false</WriteAuthFailuresToLog>
                    </authenticationProvider>
                </unicorn>
            </sitecore>
        </configuration>
        `);
        this.writeSharedSecretKeyStub = Sinon.stub(unicorn, 'writeSharedSecretKey');

        this.result = getUnicornSharedSecretKey({
          authConfigFile: '/authConfigFile'
        });
      });

      after(() => {
        this.writeSharedSecretKeyStub.restore();
        this.readFileSyncStub.restore();
      });

      it('should call writeSharedSecretKey with the right parameters', () => {
        this.writeSharedSecretKeyStub.should.have.been.calledWithExactly('/authConfigFile');
      });

      it('should call readFileSync with the right parameters', () => {
        this.readFileSyncStub.should.have.been.calledWithExactly('/authConfigFile');
      });

      it('should return the secret key', () => {
        expect(this.result).to.eq('#{UnicornSecret}');
      });
    });

    describe('when the shared secret config file exists', () => {
      before(() => {
        this.readFileSyncStub = Sinon.stub(fs, 'readFileSync').returns(`
        <configuration>
            <sitecore>
                <unicorn>
                    <authenticationProvider>
                        <SharedSecret>#{UnicornSecret}</SharedSecret>
                        <WriteAuthFailuresToLog>false</WriteAuthFailuresToLog>
                    </authenticationProvider>
                </unicorn>
            </sitecore>
        </configuration>
        `);
        this.writeSharedSecretKeyStub = Sinon.stub(unicorn, 'writeSharedSecretKey');
        this.result = getUnicornSharedSecretKey({
          authConfigFile: '/authConfigFile'
        });
      });

      after(() => {
        this.writeSharedSecretKeyStub.restore();
        this.readFileSyncStub.restore();
      });

      it('should call writeSharedSecretKey with the right parameters', () => {
        this.writeSharedSecretKeyStub.should.have.been.calledWithExactly('/authConfigFile');
      });

      it('should call readFileSync with the right parameters', () => {
        this.readFileSyncStub.should.have.been.calledWithExactly('/authConfigFile');
      });

      it('should return the secret key', () => {
        expect(this.result).to.eq('#{UnicornSecret}');
      });
    });


    describe('when options already contains a secret key', () => {
      before(() => {
        this.readFileSyncStub = Sinon.stub(fs, 'readFileSync');
        this.writeSharedSecretKeyStub = Sinon.stub(unicorn, 'writeSharedSecretKey');
        this.existsSyncStub = Sinon.stub(fs, 'existsSync').returns(false);

        this.result = getUnicornSharedSecretKey({
          secret: 'secretKey'
        });
      });

      after(() => {
        this.writeSharedSecretKeyStub.restore();
        this.readFileSyncStub.restore();
        this.existsSyncStub.restore();
      });

      it('should call existsSync with the right parameters', () => {
        return this.existsSyncStub.should.not.have.been.called;
      });


      it('should call writeSharedSecretKey with the right parameters', () => {
        return this.writeSharedSecretKeyStub.should.not.have.been.called;
      });

      it('should call readFileSync with the right parameters', () => {
        return this.readFileSyncStub.should.not.have.been.called;
      });

      it('should return the secret key', () => {
        expect(this.result).to.eq('secretKey');
      });
    });
  });

  describe('sync()', () => {
    describe('when we want to synchronize all unicorn configuration', () => {
      before(() => {
        this.shellSyncStub = Sinon.stub(execa, 'shellSync');
        this.getUnicornSharedSecretKeyStub = Sinon.stub(unicorn, 'getUnicornSharedSecretKey').returns('secretKey');

        sync({
          siteUrl: 'http://base.dev.local/'
        });
      });

      after(() => {
        this.shellSyncStub.restore();
        this.getUnicornSharedSecretKeyStub.restore();
      });

      it('should call getUnicornSharedSecretKey with the right parameters', () => {
        this.getUnicornSharedSecretKeyStub.should.have.been.calledWithExactly({
          siteUrl: 'http://base.dev.local/'
        });
      });

      it('should call sellSync with the right parameters', () => {
        this.shellSyncStub.should.have.been.calledWithExactly(Sinon.match((cmd) => {
          return typeof cmd === 'string'
            && cmd.match(/^powershell -executionpolicy unrestricted/)
            && cmd.match(/(\\|\/)unicorn(\\|\/)SyncAll\.ps1 -secret secretKey -url http:\/\/base.dev.local\/unicorn\.aspx/);
        }), {
          cwd: Sinon.match('\/unicorn\/'),
          maxBuffer: 1024 * 500,
          stdio: [ 'inherit', 'inherit', 'inherit' ]
        });
      });
    });

    describe('when we want to synchronize a list of unicorn configuration', () => {
      before(() => {
        this.shellSyncStub = Sinon.stub(execa, 'shellSync');
        this.getUnicornSharedSecretKeyStub = Sinon.stub(unicorn, 'getUnicornSharedSecretKey').returns('secretKey');

        sync({
          siteUrl: 'http://base.dev.local/',
          configs: [
            'Config1',
            'Config2'
          ]
        });
      });

      after(() => {
        this.shellSyncStub.restore();
        this.getUnicornSharedSecretKeyStub.restore();
      });

      it('should call getUnicornSharedSecretKey with the right parameters', () => {
        this.getUnicornSharedSecretKeyStub.should.have.been.calledWithExactly({
          siteUrl: 'http://base.dev.local/',
          configs: [
            'Config1',
            'Config2'
          ]
        });
      });

      it('should call sellSync with the right parameters', () => {
        this.shellSyncStub.should.have.been.calledWithExactly(Sinon.match((cmd) => {
          return typeof cmd === 'string'
            && cmd.match(/^powershell -executionpolicy unrestricted/)
            && cmd.match(/(\\|\/)unicorn(\\|\/)Sync\.ps1 -secret secretKey -url http:\/\/base.dev.local\/unicorn\.aspx -configs Config1,Config2/);
        }), {
          cwd: Sinon.match(/(\\|\/)unicorn(\\|\/)/),
          maxBuffer: 1024 * 500,
          stdio: [ 'inherit', 'inherit', 'inherit' ]
        });
      });
    });

  });

  describe('formatUrl()', () => {
    it('should return the url without the ending slash (1)', () => {
      expect(formatUrl('http://base.dev.local/')).to.equal('http://base.dev.local');
    });
    it('should return the url without the ending slash (2)', () => {
      expect(formatUrl('http://base.dev.local')).to.equal('http://base.dev.local');
    });
  });
});