# Multiple projects <Badge text="3.0.0+" />

## Introduction

One of the new feature of NodeSitecore CLI is the possibility to build and publish mutiple solutions in different directory.

Here is an example of multiple project structure:

```
.
├── ns-master-project (Master project)
│   ├── build/
│   ├── package.json
│   ├── master.sln
│   └── .nscrc
└── ns-child-project (Child project)
    ├── build/
    ├── package.json
    ├── child.sln
    └── .nscrc
```

::: warning Important
The important point here is **Master** project is dependent on **Child** project. Each project has a package.json, .nscrc file and
a build directory where the project Sitecore instance will be installed (`<outputDir>`).
:::

We can use the new `extends` key configuration to share and inherit configuration between two projects.

## Configuration files

We can considere the **Master** as the project reference. The Master `.nscrc` file looks like this:

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

Now, we can configure the **Child** project. Create a new `.nscrc` file in the **Child** project and add the following configuration:

```json
{
  "extends": "../ns-master-project/.nscrc",
  "currentWebsite": "Child",
  "siteUrl": "https://child.dev.local",
  "solutionName": "child"
}
```

The configuration of the **Child** project will be a combination of values from the **Master**
and **Child** where values in the **Child** take precedence over the same values in the **Master** project.

::: tip
When you run a nsc command on **Child**, the placeholder `<rootDir>` will be equals to the **Child** project path.
:::

::: tip
To see the final compiled values in the `ns-child-project/.nscrc`, run:

```bash
nsc inspect
```
:::

## NPM Tasks

To simlify your workflow with Visual Studio, it's recommanded to create npm tasks in your `package.json` to clean, build or publish your solution.

For the **Master** project:
```json
{
  "name": "ns-master-project",
  "version": "1.0.0",
  "scripts": {
    "sc:build": "nsc build --targets Build",
    "sc:rebuild": "nsc build --targets Rebuild",
    "sc:clean": "nsc build --targets Clean",
    "sc:publish": "nsc publish",
    "sc:sync": "nsc unicorn sync",
    "sc:inspect": "nsc inspect",
  }
}
```

And the **Child** project:

```json
{
  "name": "ns-child-project",
  "version": "1.0.0",
  "scripts": {
    "sc:build": "nsc build --targets Build",
    "sc:rebuild": "nsc build --targets Rebuild",
    "sc:clean": "nsc build --targets Clean",
    "sc:publish": "nsc publish",
    "sc:sync": "nsc unicorn sync",
    "sc:inspect": "nsc inspect",
  }
}
```


With Visual Studio and [NPM Task Runner plugin](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.NPMTaskRunner)
you're able to run task from UI.

![run-task](https://github.com/madskristensen/NpmTaskRunner/raw/master/art/verbose-output.png)

## Build & Publish Master from Child project

With CLI it is also possible to build the **Master** project from the **Child**.
To do that, we have to create a second config file named `master.nscrc` on the root of the **Child** project.

It could be something like that:

```
.
├── ns-master-project (Master project)
│   ├── build/
│   ├── package.json
│   ├── master.sln
│   └── .nscrc
└── ns-child-project (Child project)
    ├── build/
    ├── package.json
    ├── child.sln
    ├── master.nscrc  <-- here
    └── .nscrc
```

Then edit `master.nscrc` configuration and copy the following code:

```json
{
  "extends": "../ns-master-project/.nscrc",
  "rootDir": "<contextDir>/../ns-master-project",
  "outputDir": "<contextDir>/build"
}
```

::: tip
We override outputDir value to tell the CLI to publish code on the **Child** level `ns-child-project/build`.
:::

::: warning Important
`rootDir` **MUST** be configured explicitly to allow the CLI to resolve the configuration of the **Master** with the right paths.
:::

Finally add theses new NPM tasks in the `package.json` of the **Child** project.

```json
{
  "name": "ns-child-project",
  "version": "1.0.0",
  "scripts": {
    "sc:build": "nsc build --targets Build",
    "sc:rebuild": "nsc build --targets Rebuild",
    "sc:clean": "nsc build --targets Clean",
    "sc:publish": "nsc publish",
    "sc:sync": "nsc unicorn sync",
    "sc:inspect": "nsc inspect",

    "sc:master:build": "nsc run sc:build --configPath ./master.nscrc",
    "sc:master:rebuild": "nsc run sc:rebuild --configPath ./master.nscrc",
    "sc:master:clean": "nsc run sc:clean --configPath ./master.nscrc",
    "sc:master:publish": "nsc run sc:publish --configPath ./master.nscrc",
    "sc:master:sync": "nsc run sc:sync --configPath ./master.nscrc",
    "sc:master:inspect": "nsc run sc:inspect --configPath ./master.nscrc",

    "sc:build::all": "npm run sc:master:build && npm run sc:build"
  }
}
```
::: tip
The command `nsc run sc:build --configPath ./master.nscrc` take `./master.nscrc` config file, bind **Master** NPM tasks like sc:build or sc:publish.
:::

For example, NPM tasks like `sc:master:publish`  will run the `sc:publish` from **Master** `package.json` with the right configuration values.
So instead of publishing code on **Master**, this command will publish the code on **Child** level (`ns-child-project/build/`).

## Debug configuration

To debug configuration, run this inspect command:

```json
// check config for you current project
npm run sc:inspect

// check Master config on Child level
npm run sc:master:inspect
```
