const path = require('path');

module.exports = (scriptName) => process.argv.reduce((obj, value) => {
  if (path.basename(value) === scriptName) {
    obj.script = true;
    return obj;
  }

  if (obj.script) {
    if (obj.command) {
      obj.args.push(value.replace(/^--/, '-'));
    } else {
      obj.command = value;
    }
  }

  return obj;
}, { command: null, args: [] });
