#!/usr/bin/env node
const commander = require('commander');

const config = require('../src/config');
const buildSolution = require('../src/build-solution');

commander
  .alias('nsc build')
  .usage('[options]')
  .option(
    ' -a, --architecture <arch>',
    'Specify the Architecture (Auto-detected, x86, x84)'
  )
  .option(
    '-c, --configuration <config>',
    'Specify Build Configuration (Release or Debug)',
    /^(Release|Debug)$/
  )
  .option(
    '-t, --targets <targets>',
    'Specify Build Targets (Clean,Build,Rebuild)',
    (v) => v.split(',')
  )
  .option(
    '-n, --tools-version <version>',
    'Specify the .NET Tools-Version (1.0, 1.1, 2.0, 3.5, 4.0, 12.0, 14.0, 15.0, auto)'
  )
  .option(
    '-p, --solution-platform <plateform>',
    'Specify the Solution Platform (e.g. x86, x64, AnyCPU)'
  )
  .option(
    '-v, --verbosity <level>',
    'Specify the amount of information to display in the build output (quiet, minimal, normal, detailed, diagnostic)',
    /^(quiet|minimal|normal|detailed|diagnostic)$/
  )
  .option(
    '--nologo',
    'Suppress Startup Banner and Copyright Message of MSBuild',
    (v) => v + 1
  )
  .option(
    '-m, --maxcpucount <cpuNb>',
    'Specify Maximal CPU-Count to use',
    parseInt
  )
  .option(
    '-r, --node-reuse <boolean>',
    'Specify whether to enable or disable the re-use of MSBuild nodes',
    (v) => v === 'false'
  )
  .option(
    '-l, --log-command',
    'Logs the msbuild command that will be executed.',
    (v) => v + 1
  )
  .parse(process.argv);

const {
  configuration,
  targets = config.get('buildTargets'),
  maxcpucount = config.get('buildMaxCpuCount'),
  verbosity = config.get('buildVerbosity'),
  logCommand = config.get('buildLogCommand'),
  nodeReuse = config.get('buildNodeReuse'),
  toolsVersion = config.get('buildToolsVersion'),
  solutionPlatform = config.get('buildPlatform'),
  nologo
} = commander;

const options = {
  targets,
  configuration,
  logCommand,
  verbosity,
  stdout: true,
  errorOnFail: true,
  maxcpucount,
  nodeReuse,
  toolsVersion,
  nologo,
  properties: {
    Platform: solutionPlatform
  },
  customArgs: commander.args
};

buildSolution(config.solutionPath, options);
