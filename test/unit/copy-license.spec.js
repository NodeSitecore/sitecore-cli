const gulp = require('gulp');
const { Sinon } = require('../tools');
const copyLicense = require('../../src/copy-license');
const config = require('../../src/config');

describe('copyLicense', () => {
  describe('when some files are not excluded', () => {
    before(() => {
      this.gulpStub = {
        pipe: Sinon.stub()
      };

      this.srcStub = Sinon.stub(gulp, 'src').returns(this.gulpStub);
      this.destStub = Sinon.stub(gulp, 'dest').returns('gulpDestFn');

      copyLicense();
    });

    after(() => {
      this.srcStub.restore();
      this.destStub.restore();
    });

    it('should call gulp.src()', () => {
      this.srcStub.should.have.been.calledWithExactly(config.licensePath);
    });

    it('should call pipe()', () => {
      this.gulpStub.pipe.should.have.been.calledWithExactly('gulpDestFn');
    });

    it('should call gulp.dest()', () => {
      this.destStub.should.have.been.calledWithExactly('./lib');
    });
  });
});
