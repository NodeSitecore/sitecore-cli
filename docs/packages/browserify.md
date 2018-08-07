---
sidebar: auto
---
# Package Browserify

Add support configuration for browserify stack.

## Installation

```bash
$ npm install @node-sitecore/config-browserify
```

## Getters

## Configuration fields

Key | Default value | Tags | Description
--- | --- | --- | ---
bundle | `{...}` | Browserify, Vue | Bundle keys configuration for browserify stack.
directories | `{...}` | Browserify, Vue | Directories mapping for gulp task.
autoPrefixerBrowsers | `[...]` | Browserify, Vue  | Autoprefixer configuration for gulp task.

### Bundle

In your `.nscrc` file:
```json
{
   "cssBundleName": "bundle.css",
   "jsBundleName": "bundle.js",
   "jsMapName": "bundle.map.js"
}
```

Usage in javascript file:
```javascript
const config = require('@node/sitecore-config');

console.log(config.bundle); // display
```

### Directories

Directories is a mapping between your `.nscrc` configuration and the legacy javascript configuration for a Sitecore project.

```javascript
const config = require('@node/sitecore-config');

console.log(config.directories);
```

Output:

```json
{
  "src": "path/to/src",
  "featureDirectory": "path/to/src/Feature/",
  "projectDirectory": "path/to/src/Project/",
  "foundationDirectory": "path/to/src/Foundation/",
  "buildDirectory": "path/to/build/",
  "themeBuildDirectory": "path/to/build/Website"
}
```

### Autoprefixer

In your `.nscrc` file:

```json
{
  "autoPrefixerBrowsers": [
    "last 2 versions",
    "ie >= 10",
    "Safari >= 9",
    "iOS >= 8"
  ],
}
```

