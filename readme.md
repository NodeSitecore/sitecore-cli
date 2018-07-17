# node-sitecore-cli

[![Build Status](https://travis-ci.org/NodeSitecore/sitecore-cli.svg?branch=master)](https://travis-ci.org/NodeSitecore/sitecore-cli)
[![Coverage Status](https://coveralls.io/repos/github/NodeSitecore/sitecore-cli/badge.svg?branch=master)](https://coveralls.io/github/NodeSitecore/sitecore-cli?branch=master)
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

Build your solution depending on your configuration or on the given options.

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

#### With specific paths
##### From `.nscrc`

```bash
nsc build
```

> Note: `buildPaths` support glob pattern !


Configuration example:
```json
{
  "buildPaths": [
    "<solutionPath>",  // use default solution (Base.sln)
    "<rootDir>/**/*.sln" // build all solution
  ]
}
```

##### From args

```bash
nsc build --paths Base.sln,Other.sln,src/**/code/*.csproj
```

> Note: `--paths` option support glob pattern !

##### Publish Foundation/Feature/Project only

```bash
nsc build Foundation
```

### Publish command options

By default build the solution (eg. `Base.sln`) and publish it depending on your configuration or on the given options.

Option | Default value | Description
---|---|---
`--log-command, -l` | `false` | Logs the msbuild command that will be executed.
`--targets, -t <list>` | `Build` | Specify Publish Targets.
`--paths <list>` | `Base.sln,Other.sln` | Specify the solutions or projects you want to publish.
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
nsc publish --targets Clean,Build -- /noautoresponse
```

#### With specific paths
##### From `.nscrc`

```bash
nsc publish
```
> Note: `publishPaths` support glob pattern !

Configuration example:
```json
{
  "publishPaths": [
    "<solutionPath>",  // use default solution (Base.sln)
    "<rootDir>/**/*.sln" // publish all solution
  ]
}
```

##### From args

```bash
nsc publish --paths Base.sln,Other.sln,src/**/code/*.csproj
```
> Note: `--paths` option support glob pattern !

##### Publish Foundation/Feature/Project only

```bash
nsc publish Foundation
```
> Available options: `Foundation`, `Feature` or `Project`

## Contributing

Read our [contribution documentation](./CONTRIBUTING.md).


## License

The MIT License (MIT)

Copyright (c) 2018 NodeSitecore

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/

