#!/usr/bin/env node
const path = require('path');
const nuget = require('../src/nuget');

const scriptName = path.basename(__filename);

const options = process.argv.reduce((obj, value) => {
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

nuget.exec(options.command, ...options.args);
