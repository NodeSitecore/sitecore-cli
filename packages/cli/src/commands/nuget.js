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
      // console.log('options', options);
      return nuget.exec(command, ...rawArgs);
    }
  );
};
