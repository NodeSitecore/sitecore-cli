---
home: true
heroImage: https://botw-pd.s3.amazonaws.com/styles/logo-thumbnail/s3/122011/sitecore.png?itok=pmDNtFV0
actionText: Get Started →
actionLink: /usage/getting-started.md
footer: MIT Licensed | Copyright © 2018-present NodeSitecore
---

## Features

NodeSitecore CLI is a useful command line tool to automatize tasks for a pre-installed Sitecore project. 

- Build your Visual Studio solution,
- Publish your Visual Studio solution in Sitecore,
- Restore [nuget package](/packages/cli.md),
- Synchronise your project with [Unicorn](https://github.com/trustedsec/unicorn),
- Run [PowerShell script](/dev-guide/powershell.md).
- Build [multiple projects](/dev-guide/multiple-projects.md).

## Usage

```bash
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

## Packages

This repository is base on mono-repo. That mean, we have multiple packages hosted in this repository. Theses packages are the following:

- [@node-sitecore/config](/packages/config.md), a shared configuration between all other packages,
- [@node-sitecore/config-browserify](/packages/browserify.md), specific configuration for browserify stack,
- [@node-sitecore/cli](/packages/cli.md), the cli to run command across Sitecore.

## Unstable packages

- [@node-sitecore/cli-plugin-fractal](/packages/fractal.md),
- [@node-sitecore/cli-plugin-browsersync](/packages/browsersync.md),
- [@node-sitecore/cli-plugin](/packages/vue-cli.md),

## Contributing

Contributors and PR are welcome. Just berofe starting to contribute, please read our [contribution documentation](https://github.com/NodeSitecore/sitecore-cli/CONTRIBUTING.md).

## License

The MIT License (MIT)

Copyright (c) 2018 NodeSitecore

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/

