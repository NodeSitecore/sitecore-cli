const configuration = require('@node-sitecore/config');
const buildSolution = require('./build');
const nuget = require('./nuget');
const unicorn = require('./unicorn');
const copyLicense = require('./copy-license');
const publish = require('./publish');

module.exports = {
  configuration,
  buildSolution,
  build: buildSolution,
  nuget,
  unicorn,
  copyLicense,
  publish
};
