const gulp = require('gulp');
const { Sinon } = require('../tools');

const gulpMsBuild = Sinon.stub();

const buildSolution = require('proxyquire')('../../src/build-solution', {
  'gulp-msbuild': gulpMsBuild,
});

describe('buildSolution', () => {
  before(() => {
    this.gulpStub = {
      pipe: Sinon.stub(),
    };

    gulpMsBuild.returns('msbBuildReturnFn');

    this.srcStub = Sinon.stub(gulp, 'src').returns(this.gulpStub);

    buildSolution('/path', { options: 'options' });
  });

  after(() => {
    this.srcStub.restore();
    gulpMsBuild.reset();
  });

  it('should call gulp.src()', () => {
    this.srcStub.should.have.been.calledWithExactly('/path');
  });

  it('should call pipe()', () => {
    this.gulpStub.pipe.should.have.been.calledWithExactly('msbBuildReturnFn');
  });

  it('should call gulp.dest()', () => {
    gulpMsBuild.should.have.been.calledWithExactly({ options: 'options' });
  });
});
