const path = require('path');

module.exports = (scriptName, argv = process.argv) =>
  argv.reduce(
    (obj, value) => {
      if (path.basename(value) === scriptName || value === scriptName) {
        obj.script = true;
        obj.command = value;
        return obj;
      }

      if (obj.command) {
        obj.args.push(value);
      }

      return obj;
    },
    { command: null, args: [] }
  );
