const nuget = require('../nuget');

module.exports = (api, config) => {
  api.registerCommand(
    'restore',
    {
      type: 'raw',
      description: 'Restore all NuGet Packages'
    },
    () => nuget.exec('restore', config.solutionPath)
  );
};
