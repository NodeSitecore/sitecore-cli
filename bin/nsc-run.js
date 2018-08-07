#!/usr/bin/env node
const path = require('path');
const powershell = require('../src/powershell');
const getArgs = require('../src/utils/get-args');

const options = getArgs(path.basename(__filename));

powershell.exec(options.command, options.args, {});
