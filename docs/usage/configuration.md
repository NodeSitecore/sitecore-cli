# Configuration

A shared configuration between all packages based on `@node-sitecore/cli`.

## Features

- Control over configuration values.
- Support multiple configuration files by environment (`.nscrc (default)`, `.development.nscrc`, `.test.nscrc`, `.production.nscrc`).
- Support custom configuration path with `nsc [cmd] --configPath ./my-custom.config.json`,
- Extensible configuration,
- All value can be overridden by env or args variable ([nconf](https://github.com/indexzero/nconf)).

## Configuration fields

Key | Default value | Description
--- | --- | --- | ---
currentWebsite | `Common` | Current code name of the Sitecore website (Can be the same as `masterWebsite`. It used for localisation process).
masterWebsite | `Common` | Master code name of the Sitecore website.
solutionName | `Base` | Solution name of the Visual Studio project.
siteUrl | `http://base.dev.local` | Site url use on your local machine. You change this value in a separated file like `.dev.nsrc`.
authConfigFilePath | `path/to//Unicorn.UI.config` | Auth config file path required by Unicorn task.
outputDir | `<rootDir>/build` | Path to the Sitecore instance directory.
licensePath | `<outputDir>/Data/license.xml` | License path required by Sitecore.
authConfigFilePath | `<websiteDir>/App_config/Include/Unicorn/Unicorn.UI.config` | Auth config file path required by Unicorn task.
srcDir | `<rootDir>/src` | Source code directory.
foundationDir | `<srcDir>/src/Foundation` | Foundation level directory (Helix structure).
foundationScriptsDir | `<foundationDir>/Core/code/Scripts` | Scripts Foundation directory. Shortcut to the shared code.
featureDir | `<srcDir>/Feature` | Feature level directory (Helix structure).
projectDir | `<srcDir>/Project` | Project level directory (Helix structure).
websiteDir | `<outputDir>/Website` | Website directory used by Sitecore.
websiteConfigDir | `<websiteDir>/App_Config` | Sitecore website config directory.
websiteViewsDir | `<websiteDir>/Views` | Sitecore views directory.
websiteLibrariesDir | `<websiteDir>/bin` | Sitecore libraries directory.
themesDir | `<websiteDir>/themes` | Sitecore themes directory.
buildConfiguration | `Debug` | MsBuild Configuration (Release or Debug).
buildToolsVersion | `15.0` | MsBuild .NET Tools-Version (1.0, 1.1, 2.0, 3.5, 4.0, 12.0, 14.0, 15.0, auto).
buildMaxCpuCount | `0` | Maximal CPU-Count to use. (`-1`: MSBuild Default, `0`: Automatic selection, `> 0`: Concrete value).
buildVerbosity | `minimal` | Specify the amount of information to display in the build output (`quiet`, `minimal`, `normal`, `detailed`, `diagnostic`).
buildNodeReuse | `false` | MsBuild Specify whether to enable or disable the re-use of MSBuild nodes (`true` or `false`).
buildLogCommand | `false` | Logs the MsBuild command that will be executed.
excludeFilesFromDeployment | `['packages.config']` | Exclude files from the deployment on the Sitecore instance.
buildTargets | `['<solutionPath>']` | Build all solutions or/and projects. Support glob patterns.
buildPaths | `['Build']` | Build targets options (`Build`, `Clean`, `Rebuild`).
buildPlatform | `Any CPU` | Build targets options (e.g. x86, x64, Any CPU).
buildProperties | `{}` | Additional build properties.
publishTargets | `['Build']` | Publish targets options (`Build`, `Clean`, `Rebuild`).
publishTargets | `['<solutionPath>']` | Publish all solutions or/and projects. Support glob patterns.
publishPlatform | `AnyCpu` | Publish platform (e.g. x86, x64, AnyCpu).
publishProperties | `{...}`  | Additional publish properties.

### PublishProperties

Default value of publishProperties:
```json
{
  "DeployOnBuild": "true",
  "DeployDefaultTarget": "WebPublish",
  "WebPublishMethod": "FileSystem",
  "DeleteExistingFiles": "false",
  "_FindDependencies": "false"
}
```

## Hierarchical configuration

Configuration management can get complicated very quickly for even trivial applications running in production. nconf addresses this problem by enabling you to setup a hierarchy for different sources of configuration with no defaults. The order in which you attach these configuration sources determines their priority in the hierarchy. Let's take a look at the options available to you

The priority of hierarchical configuration is defined like there :

1. Default configuration from `@node-sitecore/config`,
2. Arguments given by command line tools,
3. Environment variables,
4. From file `.nscrc`,
5. From `--configPath` command line options. Example: `nsc [cmd] --configPath ./my-custom.config.json`,
6. From `.development.nscrc`, `.test.nscrc`, `.production.nscrc` or `[process.env.NODE_ENV].nscrc` according to `process.env.NODE_ENV` value.

## Extends configuration <Badge text="3.0.0+" />

In addiction with Hierarchical configuration feature, config file support the `extends` keywords to set explicitly an inheritance from another configuration file.
It useful when you manage multiple project in different directories location.

Here is an example of multiple project structure:

```
.
├─ ns-master-project
│   ├── package.json
│   ├── master.sln
│   └── .nscrc
└── ns-child-project
    ├── package.json
    ├── child.sln
    └── .nscrc
```

We can considere the ns-master-project has the project reference. His `.nscrc` his look like that:

```json
  "currentWebsite": "Master",
  "siteUrl": "https://master.dev.local",
  "instanceRoot": "<rootDir>/build",
  "websiteRoot": "<instanceDir>/Website",
  "licensePath": "<instanceDir>/Data/license.xml",
  "sitecoreLibrariesRoot": "<instanceDir>/Website/bin",
  "solutionName": "master",
  "buildToolsVersion": "15.0",
  ...
}
```

The `.nscrc` file from ns-child-project can inherit his configuration from the master project like this:

```json
{
  "extends": "../ns-master-project/.nscrc",
  "currentWebsite": "Child",
  "siteUrl": "https://child.dev.local",
  "solutionName": "child"
}
```

Now the configuration file of `ns-child-project` will be resolved with inherited values from `ns-master-project`
and overrided values from `ns-child-project`.

::: tip
When you run a nsc command on `ns-child-project`, the placeholder `<rootDir>` will be equals to the `ns-child-project` path.
:::

::: tip
To see how the values in the `ns-child-project/.nscrc` file are resolved, run:
```bash
nsc inspect
```
:::


## Getters

Config instance has getters to provide some shortcut to resolve a path based on the main configuration and your local machine configuration (Mac or Windows).

```javascript
const config = require('@node-sitecore/config');

// getters
console.log(config.currentWebsite) // Custom
console.log(config.websiteDir) // build/Website

// Or get()
console.log(config.get('customObj')) // Object {attr1: "value1", ...}

// or
console.log(config.get('customObj:attr1') // bundle

// has()
console.log(config.has('customObj:attr1')) // true

// set()
config.set('customObj:attr1', "new value");
```

Getters | Example value | Description
--- | --- | ---
`config.currentWebsite` | `Custom` | Current website used by front-end and Sitecore
`config.siteUrl` | `http://base.dev.local` | Site url configured on your local machine. Use `.development.nscrc`
`config.authConfigFile` | `path/to/build/Website/App_config/Include/Unicorn/Unicorn.UI.config` | Path the unicorn script configuration.
`config.outputDir` | `path/to/build` | Path to the Sitecore instance directory.
`config.websiteDir` | `path/to/build/Website` | Path to the Website directory <em>1</em>.
`config.themeWebsiteDir` | `path/to/build/Website/themes` | Path to the themes directory <em>1</em>.
`config.currentWebsiteDir` | `path/to/build/Website/themes/Custom` | Path to the current Website directory <em>1</em>.
`config.sitecoreLibrariesDir` | `path/to/build/Website/bin` | Path to the Sitecore libraries directory <em>1</em>.
`config.licensePath` | `path/to/build/Data/license.xml` | Path to the license file <em>1</em>.
`config.solutionPath` | `path/to/Base.sln` | Path to the Visual Studio solution <em>1</em>.
`config.websiteViewsDir` | `path/to/build/Website/Views` | Path to the Views directory <em>1</em>.
`config.websiteConfigDir` | `path/to/build/Website/App_Config` | Path to the App_Config directory <em>1</em>.
`config.srcDir` | `path/to/build/Website/src` | Path to the source code directory <em>1</em>.
`config.foundationDir` | `path/to/build/Website/src/Foundation` | Path to the Foundation directory <em>1</em>.
`config.foundationScriptsDir` | `path/to/build/Website/src/Foundation/Core/code/Scripts` |  Path to the Foundation script directory <em>1</em>.
`config.featureDir` | `path/to/build/Website/src/Feature` | Path to the Feature directory <em>1</em>.
`config.projectDir` | `path/to/build/Website/src/Project` | Path to the Project directory <em>1</em>.
`config.projectScriptsDir` | `path/to/build/Website/src/Project/Custom/code/Scripts` | Path to the current Project scripts directory <em>1</em>.
`config.currentProjectDir` | `path/to/build/Website/src/Project/Custom/code` | Path to the current Project directory <em>1</em>.
`config.buildPaths` | `[<solutionPath>]` | List of solutions or projects given to the command `nsc build`.
`config.publishPaths` | `[<solutionPath>]` |  List of solutions or projects given to the command `nsc publish`.

## Placeholders

Config class define a list of placeholders which can be used in your configuration file. It's kind of shortcut to another
field in your configuration file. A placeholder follow this pattern: `<myPlaceholderName>`

::: warning
Placeholders is a pre-defined list by the [placeholder.js](https://github.com/NodeSitecore/sitecore-cli/blob/master/packages/config/src/config.js) file.
Only plugins can add new placeholder with `Config.definePlaceholder` method.
:::

For example, one of the defined placeholder is the `<rootDir>`. Here a usage example of this placeholder:

```json
{
  "currentWebsite": "MySite",
  "siteUrl": "https://mysite.dev.local",
  "instanceDir": "<rootDir>/build",
}
```

When the Config class is loaded, the `.nscrc` configuration file will be imported and all placeholder will be resolved.

To preview the resolved configuration, you can run this command:

```bash
nsc inspect
```

Or in your project:

```js
const config = require('@node-sitecore/config');

// resolver
config.resolve('<rootDir>') // path/to/root
config.resolve('<ouputDir>') // path/to/root/build
config.resolve('<websiteDir>') // path/to/root/build/Website
config.resolve('<themesDir>') // path/to/root/build/Website/themes
config.resolve('<srcDir>') // path/to/root/src
config.resolve('<projectDir>') // path/to/root/src/Project
config.resolve('<featureDir>') // path/to/root/src/Feature
config.resolve('<foundationDir>') // path/to/root/src/Foundation
config.resolve('<currentDir>') // path/to/root/src/Project/Custom/code
```

### List of placeholder

- `<currentWebsite>`: Current code name of the Sitecore website (Can be the same as `masterWebsite`. It used for localisation process).
- `<foundationDir>`: Foundation level directory (Helix structure).
- `<featureDir>`: Feature level directory (Helix structure)
- `<projectDir>`: Project level directory (Helix structure)
- `<srcDir>`: Source code directory.
- `<themesDir>`: Themes directory.
- `<websiteDir>`: Website directory.
- `<outputDir>`: Output directory where is installed your Sitecore instance.
- `<solutionPath>`: Path to the MsBuild Solution.
- `<rootDir>`: Root directory of your project.
- `<contextDir>`: Context directory where is runned the CLI command.








