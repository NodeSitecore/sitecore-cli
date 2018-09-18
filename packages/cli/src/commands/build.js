const buildSolution = require('../msbuild/build');
const msBuildPaths = require('../utils/ms-build-paths');

const description = {
  description: 'Build project solution',
  usage: '[Feature|Foundation|Project|solution] [options]',
  options: {
    '--paths': {
      description: 'Specify solution or project you want to build',
      type: Array
    },
    '-a, --architecture <arch>': {
      description: 'Specify the Architecture (Auto-detected, x86, x84)',
      type: String
    },
    '-c, --configuration <config>': {
      description: 'Specify Build Configuration (Release or Debug)',
      pattern: /^(Release|Debug)$/
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
      type: Boolean,
      transform: v => v === 'true'
    },
    '-l, --log-command': {
      description: 'Logs the msbuild command that will be executed.',
      type: Boolean
    }
  }
};

module.exports = (api, config) => {
  api.registerCommand('build', description, (commander, args) => {
    const [publishType] = args;

    const {
      configuration,
      targets = config.get('buildTargets'),
      maxcpucount = config.get('buildMaxCpuCount'),
      verbosity = config.get('buildVerbosity'),
      logCommand = config.get('buildLogCommand'),
      nodeReuse = config.get('buildNodeReuse'),
      toolsVersion = config.get('buildToolsVersion'),
      solutionPlatform = config.get('buildPlatform'),
      solutionProperties = config.get('buildProperties'),
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
      toolsVersion: +toolsVersion,
      nologo,
      properties: {
        Platform: solutionPlatform,
        ...solutionProperties
      },
      customArgs: args.filter(item => item !== publishType)
    };

    return buildSolution(msBuildPaths({ procces: 'build', type: publishType, paths: commander.paths }), options);
  });
};
