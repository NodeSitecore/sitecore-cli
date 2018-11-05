const Table = require('cli-table');
const chalk = require('chalk');

module.exports = (api, config) => {
  api.registerCommand(
    'inspect',
    {
      description: 'Display values from resolved configuration'
    },
    () => {
      const table = new Table({
        head: ['Key', 'Type', 'Value'],
        colWidths: [40, 10, 110]
      });

      const obj = config.toObject();
      const parent = config.nconf.get('extends');

      table.push(['<contextDir>', chalk.magenta('string'), config.context]);
      table.push(['<rootDir>', chalk.magenta('string'), config.rootDir]);
      if (parent) {
        table.push([`<${parent}>`, chalk.magenta('string'), config.nconf.stores[parent].get('rootDir')]);
      }

      Object.keys(obj)
        .filter(key => ['rootDir', 'extends'].indexOf(key) === -1)
        .forEach(key => {
          let dataType = typeof obj[key];
          let value = JSON.stringify(obj[key], null, 2);

          if (dataType === 'object' && obj[key] instanceof Array) {
            dataType = 'array';
          }

          value = value.replace(new RegExp(config.rootDir, 'gi'), '<rootDir>');
          value = value.replace(new RegExp(config.context, 'gi'), '<contextDir>');

          if (parent) {
            value = value.replace(new RegExp(config.nconf.stores[parent].get('rootDir'), 'gi'), `<${parent}>`);
          }

          table.push([key, chalk.magenta(dataType), value]);
        }, []);

      console.log(table.toString());
    }
  );
};
