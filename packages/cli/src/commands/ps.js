const powershell = require('../powershell');

module.exports = api => {
  api.registerCommand(
    'ps',
    {
      type: 'raw',
      description: 'Run a powershell script'
    },
    options => powershell.exec(options.command, options.args)
  );
};
