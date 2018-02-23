const gulp = require('gulp');
const { Sinon } = require('../tools');

const gulpNugetRestoreStub = Sinon.stub();

const nugetRestore = require('proxyquire')('../../src/nuget-restore', {
  'gulp-nuget-restore': gulpNugetRestoreStub
});

describe('nugetRestore', () => {
  before(() => {
    this.gulpStub = {
      pipe: Sinon.stub()
    };

    gulpNugetRestoreStub.returns('nugetRestoreReturnFn');

    this.srcStub = Sinon.stub(gulp, 'src').returns(this.gulpStub);

    nugetRestore('/path');
  });

  after(() => {
    this.srcStub.restore();
    gulpNugetRestoreStub.reset();
  });

  it('should call gulp.src()', () => {
    this.srcStub.should.have.been.calledWithExactly('/path');
  });

  it('should call pipe()', () => {
    this.gulpStub.pipe.should.have.been.calledWithExactly('nugetRestoreReturnFn');
  });

  it('should call gulp.dest()', () => {
    gulpNugetRestoreStub.should.have.been.calledWithExactly();
  });

});