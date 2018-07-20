#!/usr/bin/env node
const config = require('@node-sitecore/config');
const nuget = require('../src/nuget');

nuget.exec('restore', config.solutionPath);
