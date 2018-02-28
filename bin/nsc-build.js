#!/usr/bin/env node
const config = require('../src/config');
const buildSolution = require('../src/build-solution');

const targets = config.runCleanBuilds ? [ 'Clean', 'Build' ] : [ 'Build' ];

buildSolution(config.solutionPath, {
  targets,
  configuration: config.get('buildConfiguration'),
  logCommand: false,
  verbosity: config.get('buildVerbosity'),
  stdout: true,
  errorOnFail: true,
  maxcpucount: config.get('buildMaxCpuCount'),
  nodeReuse: false,
  toolsVersion: config.get('buildToolsVersion'),
  properties: {
    Platform: config.get('buildPlatform')
  }
});
