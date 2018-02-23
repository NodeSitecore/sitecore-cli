#!/usr/bin/env node
'use strict';

const commander = require('commander');
const unicorn = require('../src/unicorn');
const config = require('../src/config');

unicorn.sync({
  siteUrl: config.siteUrl,
  authConfigFile: config.authConfigFile
});