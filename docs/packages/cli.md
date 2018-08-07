---
sidebar: auto
---
# Package CLI

## Installation

```bash
$ npm install @node-sitecore/cli
```

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

### Load custom configuration file

::: tip
CLI command accept a `--configPath` option, available for all subcommand, to configure the location path of your configuration file.
:::

```bash
nsc build --configPath ./my-custom.config.json
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

::: tip
It also possible to give additional arguments to the msBuild command directly. Just use `--` after the command line.
:::

```bash
nsc build --targets Clean,Build -- /noautoresponse
```

#### With specific paths
##### From `.nscrc`

```bash
nsc build
```

::: tip
`buildPaths` support glob pattern !
:::

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

::: tip
`--paths` option support glob pattern !
:::

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

::: tip
It also possible to give additional arguments to the msBuild command directly. Just use `--` after the command line.
:::

```bash
nsc publish --targets Clean,Build -- /noautoresponse
```

#### With specific paths
##### From `.nscrc`

```bash
nsc publish
```

::: tip
`publishPaths` support glob pattern !
:::

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

::: tip
`--paths` option support glob pattern !
:::

##### Publish Foundation/Feature/Project only

```bash
nsc publish Foundation
```

::: tip
Available options: `Foundation`, `Feature` or `Project`
:::