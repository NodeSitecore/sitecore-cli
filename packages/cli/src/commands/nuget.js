const nuget = require('../nuget');

module.exports = api => {
  api.registerCommand(
    'nuget',
    {
      description: 'Nuget commands',
      usage: '<command> [options]',
      options: {}
    },
    (commander, args, rawArgs) => {
      const [command] = args;

      return nuget.exec(command, ...rawArgs.splice(1));
    }
  );
};
