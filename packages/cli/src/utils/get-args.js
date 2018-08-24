const path = require('path');

module.exports = (scriptName, argv = process.argv) =>
  argv.reduce(
    (obj, value) => {
      if (path.basename(value) === scriptName || value === scriptName) {
        obj.script = true;
        return obj;
      }

      if (obj.script) {
        if (obj.command) {
          obj.args.push(value);
        } else {
          obj.command = value;
        }
      }

      return obj;
    },
    { command: null, args: [] }
  );
