const nuget = require('../nuget');

module.exports = api => {
  api.registerCommand(
    'nuget',
    {
      type: 'raw',
      description: 'Nuget commands'
    },
    options => nuget.exec(options.command, ...options.args)
  );
};
