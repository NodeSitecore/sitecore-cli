const nuget = require('../nuget');

module.exports = (api, config) => {
  api.registerCommand(
    'restore',
    {
      description: 'Restore all NuGet Packages',
      usage: '<command> [options]',
      options: {}
    },
    (commander, args, rawArgs) => nuget.exec('restore', config.solutionPath, ...rawArgs)
  );
};
