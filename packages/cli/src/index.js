const configuration = require('@node-sitecore/config');
const buildSolution = require('./msbuild/build');
const nuget = require('./nuget');
const unicorn = require('./unicorn');
const publish = require('./msbuild/publish');

module.exports = {
  configuration,
  buildSolution,
  build: buildSolution,
  nuget,
  unicorn,
  publish
};
