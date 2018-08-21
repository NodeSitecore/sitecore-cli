# Config Plugins <Badge text="3.0.0+" />

A Config plugin is an npm package that can add additional features to a `@node-sitecore/config` project. It should always contain a `Config Service Plugin` as its main export.

A typical Config plugin's folder structure looks like the following:

```
.
├── readme.md
├── index.js      # config service plugin
└── package.json
```

And here is an example of an `index.js` which extends `@node-sitecore/config`:

```javascript
module.exports = config => {

  config.defineGetter('directories', () => ({
    src: `${config.toRel(config.srcDir)}/`,
    featureDirectory: `${config.toRel(config.featureDir)}/`,
    projectDirectory: `${config.toRel(config.projectDir)}/`,
    foundationDirectory: `${config.toRel(config.foundationDir)}/`,
    buildDirectory: path.resolve(config.outputDir),
    themeBuildDirectory: path.resolve(config.themeWebsiteDir)
  }));

  config.defineGetter(
    'autoPrefixerBrowsers',
    () => config.get('autoPrefixerBrowsers') || ['last 2 versions', 'ie >= 10', 'Safari >= 9', 'iOS >= 8']
  );

  config.defineGetter('bundle', () => config.get('bundle'));
};
```

###  ConfigService Plugin

ConfigService plugins are loaded automatically when a ConfigService instance is created - i.e. only one time when the `@node-sitecore/config` module is imported inside another module or project.

A config service plugin should export a function which receives one argument:

- A [Config](https://github.com/NodeSitecore/sitecore-cli/blob/master/packages/config/src/config.js) instance

The Config allows service plugins to extend/modify the internal config for different environments. Example:

```javascript
module.exports = config => {

  config.defineGetter('myGetter', () => ({
    return "Test"
  }));

  // Now we hare a new getter on config instance
  console.log(config.myGetter)

  // Example to read a value from the .nscrc file
  config.defineGetter(
    'myGetter2',
    () => config.get('get')
  );
};
```

#### Define placeholder

A plugin can define a new placeholder with `Config.definedPlacehoder(pattern, replacementFn)`.

```javascript
module.exports = config => {

  config.definePlaceholder('myPlaceholder', () => ({
    return "/path/to/Test"
  }));

  // result
  config.resolve('<myPlaceholder>/custom') // /path/to/Test/custom
};
```

#### Define method

A plugin can define a new method with `Config.definedMethod(methodName, fn)`.

```js
module.exports = config => {

  config.defineMethod('myMethod', (...args) => ({
    return config.resolve("<myPlaceholder>/" + args.join('/'));
  }));

  // result
  config.myMethod("a", "b") // /path/to/Test/a/b
};
```

## Distributing the Plugin

For a Config plugin to be usable by other developers, it must be published
on npm following the name convention `nsc-config-<name>` or `nsc-cli-plugin-<name>`.
Following the name convention allows your plugin to be:

- Discoverable by `@node-sitecore/config`,
- Discoverable by other developers via searching.

For plugin named with `nsc-cli-plugin-<name>`, the folder structure is a bit different, because the package is
designed for the CLI. In this case, to extends configuration, the package should have this folder directory:

```
.
├── readme.md
├── index.js      # CLI service plugin used by @node-sitecore/cli
├── config.js     # Config service plugin used by @node-sitecore/config
└── package.json
```

