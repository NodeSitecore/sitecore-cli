const configuration = require('./config');
const buildSolution = require('./build-solution');
const nugetRestore = require('./nuget-restore');
const unicorn = require('./unicorn');
const copyLicense = require('./copy-license');
const copyAssemblies = require('./copy-assemblies');
const publish = require('./publish');

module.exports = {
  configuration,
  buildSolution,
  nugetRestore,
  unicorn,
  copyLicense,
  copyAssemblies,
  publish
};
