module.exports = {
  configuration: require('./config'),
  buildSolution: require('./build-solution'),
  nugetRestore: require('./nuget-restore'),
  unicorn: require('./unicorn'),
  copyLicense: require('./copy-license'),
  copyAssemblies: require('./copy-assemblies'),
  publish: require('./publish')
};