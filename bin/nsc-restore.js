#!/usr/bin/env node
const config = require('../src/config');
const nugetRestore = require('../src/nuget-restore');

nugetRestore(config.solutionPath);
