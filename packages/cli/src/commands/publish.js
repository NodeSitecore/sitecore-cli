/* eslint-disable no-case-declarations */
const publish = require('../msbuild/publish');
const publishViews = require('../sitecore/publish-views');
const publishConfig = require('../sitecore/publish-config');
const publishAssemblies = require('../sitecore/publish-assemblies');
const msBuildPaths = require('../utils/ms-build-paths');

const description = {
  description: 'Publish content (Foundation, Feature, Project)',
  usage: '[solution|views|config|Feature|Foundation|Project] [options]',
  options: {
    '--paths': {
      description: 'Specify solution or project you want to publish',
      type: Array
    },
    '-a, --architecture <arch>': {
      description: 'Specify the Architecture (Auto-detected, x86, x84)',
      type: String
    },
    '-c, --configuration <config>': {
      description: 'Specify Build Configuration (Release or Debug)',
      type: /^(Release|Debug)$/
    },
    '-t, --targets <targets>': {
      description: 'Specify Build Targets (Clean,Build,Rebuild)',
      type: Array
    },
    '-n, --tools-version <version>': {
      description: 'Specify the .NET Tools-Version (1.0, 1.1, 2.0, 3.5, 4.0, 12.0, 14.0, 15.0, auto)',
      type: String
    },
    '-p, --solution-platform <plateform>': {
      description: 'Specify the Solution Platform (e.g. x86, x64, Any CPU)',
      type: String
    },
    '-v, --verbosity <level>': {
      description: 'Specify the amount of information to display in the build output (quiet, minimal, normal, detailed, diagnostic)',
      type: /^(quiet|minimal|normal|detailed|diagnostic)$/
    },
    '--nologo': {
      description: 'Suppress Startup Banner and Copyright Message of MSBuild',
      type: Boolean
    },
    '-m, --maxcpucount <cpuNb>': {
      description: 'Specify Maximal CPU-Count to use',
      type: Number
    },
    '-r, --node-reuse <boolean>': {
      description: 'Specify whether to enable or disable the re-use of MSBuild nodes',
      type: v => v === 'true'
    },
    '-l, --log-command': {
      description: 'Logs the msbuild command that will be executed.',
      type: Boolean
    },
    '-d, --dest': {
      description: 'Directory destination',
      type: String
    }
  }
};

module.exports = (api, config) => {
  api.registerCommand('publish', description, (commander, args) => {
    const [publishType] = args;

    switch (publishType) {
      case 'views':
        return publishViews();

      case 'config':
        return publishConfig();

      case 'assemblies':
        return publishAssemblies();

      default:
      case 'solution':
        args = args.slice(1, args.length);

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
          toolsVersion: +toolsVersion,
          nologo,
          properties: {
            Platform: publishPlatform,
            ...publishProperties
          },
          customArgs: commander.args.slice(0, commander.args.length - 1).filter(item => item !== publishType)
        };

        return publish(msBuildPaths({ process: 'publish', type: publishType, paths: commander.paths }), dest, options);
    }
  });
};
