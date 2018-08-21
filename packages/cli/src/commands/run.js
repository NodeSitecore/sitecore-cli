const run = require('../run');

module.exports = api => {
  api.registerCommand(
    'run',
    {
      description: 'Run npm script located on <rootDir> configured in your .nscrc file',
      usage: '[npmCmd] [options]'
    },
    (commander, args) => {
      const [cmd] = args;

      run.exec(cmd, []);
    }
  );
};
