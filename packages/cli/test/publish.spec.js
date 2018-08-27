/* eslint-disable import/order */
const gulp = require('gulp');
const { Sinon } = require('../../test/tools');

const msBuild = Sinon.stub();
const foreach = Sinon.stub();

const publish = require('proxyquire')('../src/msbuild/publish', {
  'gulp-msbuild': msBuild,
  'gulp-foreach': foreach
});

describe('publish()', () => {
  before(() => {
    this.gulpStub = {
      pipe: Sinon.stub(),
      on: Sinon.stub()
    };

    this.gulpStub.pipe.returns(this.gulpStub);

    this.srcStub = Sinon.stub(gulp, 'src').returns(this.gulpStub);

    publish('src', 'dest', { options: 'options' });
    // this.gulpStub.pipe.getCall(0).args[0]();
    foreach.getCall(0).args[0](this.gulpStub);
  });

  after(() => {
    this.srcStub.restore();
  });

  it('should get src path', () => {
    this.srcStub.should.be.calledWithExactly(['src']);
  });
  it('should call foreach', () => {
    msBuild.should.have.been.calledWithExactly({ logCommand: true, options: 'options', properties: { publishUrl: 'dest' } });
  });
});
