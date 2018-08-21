# node-sitecore-cli

[![Build Status](https://travis-ci.org/NodeSitecore/sitecore-cli.svg?branch=master)](https://travis-ci.org/NodeSitecore/sitecore-cli)
[![Coverage Status](https://coveralls.io/repos/github/NodeSitecore/sitecore-cli/badge.svg?branch=master)](https://coveralls.io/github/NodeSitecore/sitecore-cli?branch=master)
[![npm version](https://badge.fury.io/js/%40node-sitecore%2Fcli.svg)](https://badge.fury.io/js/node-sitecore-cli)
[![Dependencies](https://david-dm.org/NodeSitecore/sitecore-cli.svg)](https://david-dm.org/NodeSitecore/sitecore-cli#info=dependencies)
[![img](https://david-dm.org/NodeSitecore/sitecore-cli/dev-status.svg)](https://david-dm.org/NodeSitecore/sitecore-cli/#info=devDependencies)
[![img](https://david-dm.org/NodeSitecore/sitecore-cli/peer-status.svg)](https://david-dm.org/NodeSitecore/sitecore-cli/#info=peerDependenciess)
[![Known Vulnerabilities](https://snyk.io/test/github/NodeSitecore/sitecore-cli/badge.svg)](https://snyk.io/test/github/NodeSitecore/sitecore-cli)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> A Sitecore CLI

## Installation

```bash
$ npm install @node-sitecore/config @node-sitecore/cli --save-dev
```

> For more details see our installation guide [https://node-sitecore.gitbook.io/sitecore-cli/usage/installation].

## Usage

```
  Usage: nsc <command> [options]

  Options:

    -h, --help        output usage information
    -h, --configPath  Load a configuration file from specific location path

  Commands:

    init      Init a Sitecore Project
    build     Build project solution
    nuget     Nuget commands
    publish   Publish content (Foundation, Feature, Project)
    restore   Restore all NuGet Packages
    ps        Run a powershell script
    run       Run npm script located on <rootDir> configured in your .nscrc file
    unicorn   Perform a Unicorn synchronisation
    inspect   Display values from resolved configuration

  run nsc [command] --help for usage of a specific command.
```

## Contributing

Read our [contribution documentation](https://NodeSitecore.github.io/sitecore-cli/CONTRIBUTING.md).


## License

The MIT License (MIT)

Copyright (c) 2018 NodeSitecore

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/

