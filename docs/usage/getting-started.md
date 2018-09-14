# Getting Started

::: warning COMPATIBILITY NOTE
NodeSitecore CLI requires Node.js >= 8.
:::

NodeSitecore CLI is a useful command line tool to automatize tasks for a Sitecore project. Theses tasks are following:

- Build your Visual Studio solution,
- Publish your Visual Studio solution in Sitecore,
- Restore nuget package,
- Synchronise your project with [Unicorn](),
- Run PowerShell script.

The cli will be installed on a pre-installed Sitecore Project. This tool doens't generate a Sitecore project.

## Prerequisite

- A Sitecore project initialized from Habitat project or from scratch,
- Node.js v8+,
- NPM 5.6+.

## Installation

For Sitecore projects we recommend installing `sitecore-cli` locally and
running sitecore-cli command with [npx](https://www.npmjs.com/package/npx):

```bash
$ npm install --save-dev @node-sitecore/config @node-sitecore/cli
```


Then we'll initialise the configuration for your Sitecore project. To do that,
run this command:

```bash
$ npx nsc init
```

This command run a wizard and ask you some questions:

```bash
? What is the code name of your website ? MySite
? What is the website url ? https://mysite.dev.local
? What is the path of your instance ? <rootDir>/build
? What is the relative path of your Website (from instanceDir) ? <instanceDir>/Website
? What is the relative path of license.xml (from instanceDir) ? <instanceDir>/Data/license.xml
? What is the relative path of the Sitecore librairies  (from instanceDir) ? <instanceDir>/Website/bin
? What is the name of your Solution.sln (MySitecore.sln) ? MySite
? What is the version of your Microsoft Build Tools (MsBuildTools) ? 15.0
```

**Notes:**

- The code name of your website should be the name of your directory under `src/Project/{currentWebsite}`. It depend on your Sitecore configuration.
- The path of your instance is where your Sitecore instance is installed.

After answering questions, this command will generate a `.nscrc` (on project root) file where your configuration for the cli is stored.
It should look something like this:

```json
{
  "currentWebsite": "MySite",
  "siteUrl": "https://mysite.dev.local",
  "instanceRoot": "<rootDir>/build",
  "websiteRoot": "<instanceDir>/Website",
  "licensePath": "<instanceDir>/Data/license.xml",
  "sitecoreLibrariesRoot": "<instanceDir>/Website/bin",
  "solutionName": "MySite",
  "buildToolsVersion": "15.0",
  "srcRoot": "<rootDir>/src",
  "foundationRoot": "<srcDir>/Foundation",
  "foundationScriptsRoot": "<foundationDir>/Core/code/Scripts",
  "featureRoot": "<srcDir>/Feature",
  "projectRoot": "<srcDir>/Project",
  "authConfigFilePath": "<websiteDir>/App_config/Include/Unicorn/Unicorn.UI.config",
  "buildConfiguration": "Debug",
  "buildMaxCpuCount": 0,
  "buildVerbosity": "minimal",
  "buildNodeReuse": false,
  "buildLogCommand": false,
  "excludeFilesFromDeployment": [
    "packages.config"
  ],
  "buildTargets": [
    "Build"
  ],
  "buildPaths": [
    "<solutionPath>"
  ],
  "buildPlatform": "Any CPU",
  "buildProperties": {},
  "publishTargets": [
    "Build"
  ],
  "publishPaths": [
    "<solutionPath>"
  ],
  "publishPlatform": "AnyCpu",
  "publishProperties": {
    "DeployOnBuild": "true",
    "DeployDefaultTarget": "WebPublish",
    "WebPublishMethod": "FileSystem",
    "DeleteExistingFiles": "false",
    "_FindDependencies": "false"
  },
  "bundles": {
    "bundleName": "bundle",
    "polyfills": "polyfills",
    "styleguide": "styleguide"
  },
  "type": "literal"
}
```

### Add NPM tasks for Visual Studio<Bagde text="recommanded" />

To simplify your workflow with Visual Studio, it's recommanded to create npm tasks in your `package.json` to clean, build or publish your solution.

```json
{
  "name": "my-sitecore-project",
  "version": "1.0.0",
  "scripts": {
    "sc:build": "nsc build --targets Build",
    "sc:rebuild": "nsc build --targets Rebuild",
    "sc:clean": "nsc build --targets Clean",
    "sc:publish": "nsc publish",
    "sc:sync": "nsc unicorn sync",
    "sc:inspect": "nsc inspect"
  }
}
```

Now with Visual Studio and [NPM Task Runner plugin](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.NPMTaskRunner)
you're able to run task from UI.

![run-task](https://github.com/madskristensen/NpmTaskRunner/raw/master/art/verbose-output.png)