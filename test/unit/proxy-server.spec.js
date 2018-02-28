const browserSync = require('browser-sync');
const {
  Sinon
} = require('../tools');
const config = require('../../src/config');
const path = require('path');
const formatPath = require('../../src/format-path');
const proxyServer = require('../../src/proxy-server');

describe('proxyServer', () => {
  const staticPath = formatPath(path.join(config.get('instanceRoot'), config.get('websiteRoot')));

  before(() => {
    this.browserSyncStub = {
      init: Sinon.stub()
    };

    this.browserSyncCreateStub = Sinon.stub(browserSync, 'create').returns(this.browserSyncStub);

    proxyServer({
      url: 'http://host',
      port: 8080,
      local: 'FR'
    });

    this.result = this.browserSyncStub.init.getCall(0).args[ 0 ].snippetOptions.rule.fn('</body>', '</html>');
  });
  after(() => {
    this.browserSyncCreateStub.restore();
  });
  it('should have been called', () => {
    this.browserSyncCreateStub.should.have.been.calledWithExactly();
  });
  it('should have the correct params', () => {
    this.browserSyncStub.init.should.have.been.calledWithExactly(Sinon.match({
      open: false,
      files: [ `${staticPath}/**/*.{js,css}` ],
      proxy: {
        target: 'http://host'
      },
      port: 8080,
      logLevel: 'debug',
      serveStatic: [
        staticPath
      ],
      serveStaticOptions: {
        extensions: [ 'html' ] // pretty urls
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
