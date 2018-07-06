const browserSync = require('browser-sync');
const config = require('@node-sitecore/config');
const {
  Sinon
} = require('../tools');
const path = require('path');
const execa = require('execa');
const formatPath = require('../../src/utils/format-path');
const proxyServer = require('../../src/proxy-server');

describe('proxyServer', () => {
  const staticPath = formatPath(path.join(config.buildRoot, config.get('websiteRoot')));

  before(() => {
    this.browserSyncStub = {
      init: Sinon.stub()
    };

    this.browserSyncCreateStub = Sinon.stub(browserSync, 'create').returns(this.browserSyncStub);
    this.shellStub = Sinon.stub(execa, 'shell');

    proxyServer({
      url: 'http://host',
      port: 8080,
      package: 'FR',
      concurrently: 'npm run test'
    });

    this.result = this.browserSyncStub.init.getCall(0).args[0].snippetOptions.rule.fn('</body>', '</html>');
  });
  after(() => {
    this.browserSyncCreateStub.restore();
    this.shellStub.restore();
  });
  it('should call browserSync', () => {
    this.browserSyncCreateStub.should.have.been.calledWithExactly();
  });
  it('should call execa.shell', () => {
    this.shellStub.should.have.been.calledWithExactly('npm run test', { stdio: ['inherit', 'inherit', 'inherit'] });
  });
  it('should have the correct params', () => {
    this.browserSyncStub.init.should.have.been.calledWithExactly(Sinon.match({
      open: false,
      files: [`${staticPath}/**/*.{js,css}`],
      proxy: {
        target: 'http://host'
      },
      port: 8080,
      logLevel: 'debug',
      serveStatic: [
        staticPath
      ],
      serveStaticOptions: {
        extensions: ['html'] // pretty urls
      },
      snippetOptions: Sinon.match.any
    }));
  });

  it('should return a snippet with the right content', () => {
    this.result.should.contains('</body>');
    this.result.should.contains('/themes/FR/bundle.css');
    this.result.should.contains('/themes/FR/bundle.js');
    this.result.should.contains('</html>');
  });
});
