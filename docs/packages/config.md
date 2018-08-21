---
sidebar: auto
---
# Package Config

## Features

- Control over configuration values.
- Support multiple configuration files by environment (.nscrc (default), .development.nscrc, .test.nscrc, .production.nscrc).
- All value can be overridden by env or args variable ([nconf](https://github.com/indexzero/nconf))

## Installation

```bash
$ npm install @node-sitecore/config --save-dev
```

> Documentation about available options is documented on [Configuration page](/usage/configuration.md).

## Usage

In node.js:
```javascript
const config = require('@node-sitecore/config');

// getters
console.log(config.currentWebsite) // Custom
console.log(config.websiteRoot) // build/Website

// get()

console.log(config.get('bundles')) // Object {bundleName: "bundle", ...}

// or

console.log(config.get('bundles:bundleName') // bundle

// has()
console.log(config.has('bundle:bundleName')) // true


// set()
config.set('bundle:bundleName', "bundle-app");

// resolver
config.resolve('<rootDir>') // path/to/root
config.resolve('<instanceDir>') // path/to/root/build
config.resolve('<websiteDir>') // path/to/root/build/Website
config.resolve('<themesDir>') // path/to/root/build/Website/themes
config.resolve('<srcDir>') // path/to/root/src
config.resolve('<projectDir>') // path/to/root/src/Project
config.resolve('<featureDir>') // path/to/root/src/Feature
config.resolve('<foundationDir>') // path/to/root/src/Foundation
config.resolve('<currentDir>') // path/to/root/src/Project/Custom/code
config.resolve('<masterDir>') // path/to/root/src/Project/Common/code

// resolver + concat path
config.resolve('<masterDir>', 'Styles') // path/to/root/src/Project/Common/code/Styles
```

::: tip
API is documented on [Configuration page](https://NodeSitecore.github.io/sitecore-cli/usage/configuration).
:::