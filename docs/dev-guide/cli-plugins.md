# CLI Plugins <Badge text="3.0.0+" />

A CLI plugin is an npm package that can add additional features to a `@node-sitecore/cli` project.
It should always contain a Service Plugin as its main export.

A typical Config plugin's folder structure looks like the following:

```
.
├── readme.md
├── index.js      # CLI service plugin used by @node-sitecore/cli
├── config.js     # (optional) Config service plugin used by @node-sitecore/config
└── package.json
```

### CliService Plugin

CliService plugins are loaded automatically when a CliService instance is created - i.e. everytime when a `nsc` command is invoked.

In addition, @node-sitecore/cli's built-in commands and config modules are also all implemented as service plugins.

A service plugin should export a function which receives two arguments:

- A PluginAPI instance,
- An object containing project local options specified in `.nscrc`:

The API allows service plugins to extend/modify the internal config for different environments and inject additional commands to nsc-cli.
Example:

```js
module.exports = (api, config) => {

  const helpConfig = {
    description: 'Run test',
    usage: '<value> [options]', // display: nsc test [options]
    options: {
       // String 'nsc cmd -p **/**.spec.js'
       '-p, --pattern <pattern>': {
         type: String,
         description: 'String example'
       },

       // Boolean  'nsc cmd --no-colors'
       '--no-colors': {
         description: 'Boolean example',
         type: Boolean
       },

       // Boolean  'nsc cmd --node-reuse true'
       '-r, --node-reuse <boolean>': {
         description: 'Boolean example with explicite value',
         type: Boolean,
         transform: v => v === 'true'
       },

       // Number 'nsc cmd -m 10'
       '-m, --maxcpucount <cpuNb>': {
         description: 'Number example',
         type: Number
       },

       // Enum 'nsc cmd -e Release'
       '-e, --enum <enumValue>': {
         description: 'Enum value',
         pattern: /^(Release|Debug)$/
       },

       // Array 'nsc cmd --paths Path1,Path2
       '--paths': {
         type: Array
         description: 'Specify a list of path',
       },
    }
  }

  api.registerCommand('test', helpConfig, (commander, args) => {
     const [value] = args; // any arguments which not match with options
     const {pattern, noColors, nodeReuse, maxcpucount, enum, paths} = commander;

     // ...
  });
}
```

::: warning
You should not extend config here. There is a `config.js` file to do that.
:::

## Distributing the Plugin

For a CLI plugin to be usable by other developers, it must be published
on npm following the name convention `nsc-cli-plugin-<name>`.
Following the name convention allows your plugin to be:

- Discoverable by `@node-sitecore/cli`,
- Discoverable by other developers via searching.
