#!/usr/bin/env node
const config = require('@node-sitecore/config');
const nugetRestore = require('../src/nuget-restore');

nugetRestore(config.solutionPath);
