const gulp = require('gulp');
const { Sinon } = require('../tools');

const tapStub = Sinon.stub();

const watch = require('proxyquire')('../../src/watch', {
  'gulp-tap': tapStub
});

const formatPath = require('../../src/format-path');

describe('watch', () => {

  describe('watch', () => {
    describe('when some files are excluded', () => {
      before(() => {
        this.gulpStub = {
          pipe: Sinon.stub()
        };

        this.srcStub = Sinon.stub(gulp, 'src').returns(this.gulpStub);
        this.watchStub = Sinon.stub(gulp, 'watch');
        this.destStub = Sinon.stub(gulp, 'dest').returns('gulpDestFn');

        tapStub.returns('tapReturnFn');

        watch.watch({
          src: 'src',
          dest: 'dest',
          files: '/**/*.css',
          exclude: true
        });

        tapStub.getCall(0).args[ 0 ]('stream', { path: '/path' });
        this.watchStub.getCall(0).args[ 1 ]({ type: 'changed', path: '/other' });
      });

      after(() => {
        this.srcStub.restore();
        this.watchStub.restore();
        this.destStub.restore();
        tapStub.reset();
      });

      it('should call gulp.src() (1)', () => {
        this.srcStub.getCall(0).should.have.been.calledWithExactly(
          [ './src/src', '!./src/**/obj/src' ],
          { base: formatPath('.\\src') }
        );
      });

      it('should call pipe (1)', () => {
        this.gulpStub.pipe.getCall(0).should.have.been.calledWithExactly('tapReturnFn');
      });

      it('should call gulp.watch()', () => {
        this.watchStub.should.have.been.calledWithExactly('/path/**/*.css', Sinon.match.func);
      });

      it('should call gulp.src() (watch)', () => {
        this.srcStub.getCall(1).should.have.been.calledWithExactly(
          '/other',
          { base: '/path' }
        );
      });

      it('should call pipe (watch)', () => {
        this.gulpStub.pipe.getCall(1).should.have.been.calledWithExactly('gulpDestFn');
      });

      it('should call gulp.dest()', () => {
        this.destStub.should.have.been.calledWithExactly(Sinon.match(formatPath('build/Website/dest')));
      });

    });

    describe('when some files are not excluded', () => {
      before(() => {
        this.gulpStub = {
          pipe: Sinon.stub()
        };

        this.srcStub = Sinon.stub(gulp, 'src').returns(this.gulpStub);
        this.watchStub = Sinon.stub(gulp, 'watch');
        this.destStub = Sinon.stub(gulp, 'dest').returns('gulpDestFn');

        tapStub.returns('tapReturnFn');

        watch.watch({
          src: 'src',
          dest: 'dest',
          files: '/**/*.css',
          exclude: false
        });

        tapStub.getCall(0).args[ 0 ]('stream', { path: '/path' });
        this.watchStub.getCall(0).args[ 1 ]({ type: 'changed', path: '/other' });
      });

      after(() => {
        this.srcStub.restore();
        this.watchStub.restore();
        this.destStub.restore();
        tapStub.reset();
      });

      it('should call gulp.src() (1)', () => {
        this.srcStub.getCall(0).should.have.been.calledWithExactly(
          [ './src/src' ],
          { base: formatPath('.\\src') }
        );
      });

      it('should call pipe (1)', () => {
        this.gulpStub.pipe.getCall(0).should.have.been.calledWithExactly('tapReturnFn');
      });

      it('should call gulp.watch()', () => {
        this.watchStub.should.have.been.calledWithExactly('/path/**/*.css', Sinon.match.func);
      });

      it('should call gulp.src() (watch)', () => {
        this.srcStub.getCall(1).should.have.been.calledWithExactly(
          '/other',
          { base: '/path' }
        );
      });

      it('should call pipe (watch)', () => {
        this.gulpStub.pipe.getCall(1).should.have.been.calledWithExactly('gulpDestFn');
      });

      it('should call gulp.dest()', () => {
        this.destStub.should.have.been.calledWithExactly(Sinon.match(formatPath('build/Website/dest')));
      });

    });
  });


  describe('watchCss()', () => {
    before(() => {
      this.watchStub = Sinon.stub(watch, 'watch');
      watch.watchCss();
    });
    after(() => {
      this.watchStub.restore();
    });

    it('should watch configuration', () => {
      this.watchStub.should.have.been.calledWithExactly({
        src: '**/styles',
        dest: 'styles',
        files: '/**/*.css',
        exclude: true
      });
    });
  });

  describe('watchViews()', () => {
    before(() => {
      this.watchStub = Sinon.stub(watch, 'watch');
      watch.watchViews();
    });
    after(() => {
      this.watchStub.restore();
    });

    it('should watch configuration', () => {
      this.watchStub.should.have.been.calledWithExactly({
        src: '**/Views',
        dest: 'Views',
        files: '/**/*.chtml',
        exclude: true
      });
    });
  });

  describe('watchAssemblies()', () => {
    before(() => {
      this.watchStub = Sinon.stub(watch, 'watch');
      watch.watchAssemblies();
    });
    after(() => {
      this.watchStub.restore();
    });

    it('should watch configuration', () => {
      this.watchStub.should.have.been.calledWithExactly({
        src: '**/code/**/bin',
        dest: 'bin/',
        files: '/**/Sitecore.{Feature,Foundation,Habitat}.*.{dll,pdb}',
        exclude: false
      });
    });
  });
});