#!/usr/bin/env node

const commander = require('commander');

const config = require('../src/config');
const publish = require('../src/publish');

let publishType = 'all';

commander
  .alias('nsc publish')
  .usage('<Feature|Foundation|Project|all> [options]')
  .option(
    '-a, --architecture <arch>',
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
    'Specify the Solution Platform (e.g. x86, x64, Any CPU)'
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
  .option(
    '-d, --dest',
    'Directory destination',
    (v) => v + 1
  )
  .action((_publishType_) => {
    publishType = _publishType_;
  })
  .parse(process.argv);

const {
  configuration,
  targets = config.get('publishTargets'),
  maxcpucount = config.get('buildMaxCpuCount'),
  verbosity = config.get('buildVerbosity'),
  logCommand = config.get('buildLogCommand'),
  nodeReuse = config.get('buildNodeReuse'),
  toolsVersion = config.get('buildToolsVersion'),
  publishPlatform = config.get('publishPlatform'),
  publishProperties = config.get('publishProperties'),
  nologo,
  dest = config.websiteRoot
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
  toolsVersion: (+toolsVersion),
  nologo,
  properties: {
    Platform: publishPlatform,
    ...publishProperties
  },
  customArgs: commander.args.slice(0, commander.args.length - 1).filter((item) => item !== publishType)
};

let paths;

switch (publishType) {
  case 'all':
  default:
    paths = [
      `${config.get('foundationPath')}/**/code/*.csproj`,
      `${config.get('featurePath')}/**/code/*.csproj`,
      `${config.get('projectPath')}/**/code/*.csproj`
    ];

    break;
  case 'Foundation':
    paths = [
      `${config.get('foundationPath')}/**/code/*.csproj`
    ];
    break;

  case 'Feature':
    paths = [
      `${config.get('featurePath')}/**/code/*.csproj`
    ];
    break;

  case 'Project':
    paths = [
      `${config.get('featurePath')}/**/code/*.csproj`
    ];
    break;
}

publish(paths, dest, options);
