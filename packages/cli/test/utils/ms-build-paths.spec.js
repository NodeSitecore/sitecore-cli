const config = require('@node-sitecore/config');
const path = require('path');
const { expect } = require('../../../test/tools');
const msBuildPaths = require('../../src/utils/ms-build-paths');

describe('msBuildPaths()', () => {
  describe('when paths is given', () => {
    it('should return paths', () => {
      expect(msBuildPaths({ paths: [path.normalize('test/**.cproj')] })).to.deep.eq([path.normalize('test/**.cproj')]);
    });
  });

  describe('when paths is not given (type = solution)', () => {
    it('should return paths', () => {
      expect(msBuildPaths({ type: 'solution' })).to.deep.eq([path.normalize(config.solutionPath)]);
    });
  });

  describe('when paths is not given (type = undefined)', () => {
    it('should return paths', () => {
      expect(msBuildPaths()).to.deep.eq([path.normalize(config.solutionPath)]);
    });
  });

  describe('when paths is not given (type = undefined, process = build)', () => {
    it('should return paths', () => {
      expect(msBuildPaths({ process: 'build' })).to.deep.eq([path.normalize(config.solutionPath)]);
    });
  });

  describe('when paths is not given (type = undefined, process = build)', () => {
    it('should return paths', () => {
      expect(msBuildPaths({ process: 'publish' })).to.deep.eq([path.normalize(config.solutionPath)]);
    });
  });

  describe('when paths is not given (type = all)', () => {
    it('should return paths', () => {
      expect(msBuildPaths({ type: 'all' })).to.deep.eq([path.normalize(config.solutionPath)]);
    });
  });

  describe('when paths is not given (type = Foundation)', () => {
    it('should return paths', () => {
      expect(msBuildPaths({ type: 'Foundation' })).to.deep.eq([path.normalize(`${config.foundationRoot}/**/code/*.csproj`)]);
    });
  });

  describe('when paths is not given (type = Feature)', () => {
    it('should return paths', () => {
      expect(msBuildPaths({ type: 'Feature' })).to.deep.eq([path.normalize(`${config.featureRoot}/**/code/*.csproj`)]);
    });
  });

  describe('when paths is not given (type = Project)', () => {
    it('should return paths', () => {
      expect(msBuildPaths({ type: 'Project' })).to.deep.eq([path.normalize(`${config.projectRoot}/**/code/*.csproj`)]);
    });
  });
});
