# node-sitecore-cli

[![Build Status](https://travis-ci.org/NodeSitecore/sitecore-cli.svg?branch=master)](https://travis-ci.org/NodeSitecore/sitecore-cli)
[![Coverage Status](https://coveralls.io/repos/github/NodeSitecore/sitecore-cli/badge.svg?branch=master)](https://coveralls.io/github/NodeSitecore/sitecore-cli?branch=master)
[![Package Quality](http://npm.packagequality.com/badge/@node-sitecore/cli.png)](http://packagequality.com/#?package=@node-sitecore/cli)
[![npm version](https://badge.fury.io/js/%40node-sitecore%2Fcli.svg)](https://badge.fury.io/js/node-sitecore-cli)
[![Dependencies](https://david-dm.org/NodeSitecore/sitecore-cli.svg)](https://david-dm.org/NodeSitecore/sitecore-cli#info=dependencies)
[![img](https://david-dm.org/NodeSitecore/sitecore-cli/dev-status.svg)](https://david-dm.org/NodeSitecore/sitecore-cli/#info=devDependencies)
[![img](https://david-dm.org/NodeSitecore/sitecore-cli/peer-status.svg)](https://david-dm.org/NodeSitecore/sitecore-cli/#info=peerDependenciess)
[![Known Vulnerabilities](https://snyk.io/test/github/NodeSitecore/sitecore-cli/badge.svg)](https://snyk.io/test/github/NodeSitecore/sitecore-cli)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> A Sitecore cli

## Installation

```bash
$ npm install -g @node-sitecore/cli
```

## Usage

```
 Usage: nsc [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    init        Create configuration file for a Sitecore Project
    restore     Restore all NuGet Packages
    install     Install a sitecore package
    build       Build project solution
    unicorn     Perform a Unicorn synchronisation
    publish     Publish content (Foundation, Feature, Project)
    help [cmd]  display help for [cmd]
    
```

### Build command options

Option | Default value | Description
---|---|---
`--log-command, -l` | `false` | Logs the msbuild command that will be executed.
`--targets, -t <list>` | `Build` | Specify Build Targets.
`--configuration, -c <config>` | `Debug` | Specify Build Configuration (Release or Debug).
`--solution-platform, -p <plateform>` | `AnyCPU` | Specify the Solution Platform (e.g. x86, x64, AnyCPU).
`--tools-version, -n <version>` | `15.0` | Specify the .NET Tools-Version (1.0, 1.1, 2.0, 3.5, 4.0, 12.0, 14.0, 15.0, auto).
`--architecture, -a <arch>` | `Auto-detected` | Specify the Architecture (x86, x64).
`--verbosity, -v <level>` | `minimal` | Specify the amount of information to display in the build output (quiet, minimal, normal, detailed, diagnostic).
`--maxcpucount, -m <cpunb>` | `0` | Specify Maximal CPU-Count to use. (`-1`: MSBuild Default, `0`: Automatic selection, `> 0`: Concrete value).
`--node-reuse, -r <boolean>` | `true` | Specify whether to enable or disable the re-use of MSBuild nodes (true or false).
`--nologo` |  | Suppress Startup Banner and Copyright Message of MSBuild.

> It also possible to give additional arguments to the msBuild command directly. Just use `--` after the command line.

```bash
nsc build --targets Clean,Build -- /noautoresponse
```