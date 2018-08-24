const powershell = require('../powershell');

module.exports = api => {
  api.registerCommand(
    'ps',
    {
      description: 'Run a powershell script',
      usage: '<scriptPath> [options]',
      options: {}
    },
    (commander, args, rawArgs) => {
      const [scriptPath] = args;

      return powershell.exec(scriptPath, ...rawArgs);
    },
    options => powershell.exec(options.command, options.args)
  );
};
