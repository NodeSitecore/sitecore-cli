# NodeSitecore/cli-plugin-vue

Add support configuration for Vue-cli stack.

## Installation

To begin, generate your front-end project with [Vue-cli](https://cli.vuejs.org/guide/installation.html)
and run the generator:

```bash
$ vue create .
```

Select theses recommanded options:

- Babel,
- Vuex (optional),
- CSS Pre-processor (Sass),
- Linter (ESlint),
- Unit test (Jest)

Then install `@node-sitecore/cli-plugin-vue` with npm or yarn:

```bash
$ npm install @node-sitecore/cli-plugin-vue
```

## Cli

This package add a new command:

```bash
Usage: nsc vue <build|check> [options]

Options:

  -V, --version            output the version number
  --configPath <path>      Path to .nscrc file
  --currentWebsite <code>  Default current website to compile source
  -p, --pattern <cmd>      Glob pattern to list project
  -l, --list <cmd>         Website code list (EU,FR,etc)
  -e, --exclude <cmd>      Exclude Website code list (Common,etc)
  -h, --help               output usage information

Example:
  nsc vue build                  // build only the default currentWebsite
  nsc vue build --list EU,FR
  nsc vue build --pattern "scr/Project/*" --exclude Hotfix,Common
  nsc check                      // Check if entries exists for a given currentWebsite
```

Build command is a shortcut to compile multiple Sitecore Projects. It's an equivalent of:

```bash
vue-cli-service build --currentWebsite EU --production
vue-cli-service build --currentWebsite FR --production
```

## Configuration

Now, edit the `vue.config.js` and copy this configuration:

```javascript
const config = require('@node-sitecore/config');

const vueConfig = {
  baseUrl: '',
  // whether to use eslint-loader for lint on save.
  // valid values: true | false | 'error'
  // when set to 'error', lint errors will cause compilation to fail.
  lintOnSave: false,

  // Use the full build with in-browser compiler
  runtimeCompiler: true,

  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  configureWebpack: {},

  // Remove sourcemap in production
  productionSourceMap: true,

  // Disable hashing, is performed by Sitecore
  filenameHashing: false,


  // CSS related options
  css: {
    // pass custom options to pre-processor loaders. e.g. to pass options to
    // sass-loader, use { sass: { ... } }
    loaderOptions: {}
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,

  // split vendors using autoDLLPlugin?
  // can also be an explicit Array of dependencies to include in the DLL chunk.
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
  // dll: false,
  // options for the PWA plugin.
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {
    exclude: [
      /\.map$/,
      /img\/icons\//,
      /manifest\.json$/
    ],
    workboxOptions: {
      swDest: `../../service-worker.${config.currentWebsite}.js`,
      runtimeCaching: []
    }
  },

  chainWebpack(webpackConfig) {

    // Configuration to extract img/svg from the bundle
    // webpackConfig.module
    //  .rule('images')
    //  .use('url-loader')
    //  .loader('url-loader')
    //  .tap(options => Object.assign(options, { limit: 1 }));

    // Add support to import SVG as a vue module
    // const svgRule = webpackConfig.module.rule('svg');
    // svgRule.uses.clear();

    // svgRule
    //   .use('vue-svg-loader')
    //   .loader('vue-svg-loader');

  }
};

module.exports = config.buildVueConfig(vueConfig);
```

If you use Jest, edit `jest.config.js` also:

```javascript
const config = require('@node-sitecore/config');

module.exports = {
  testPathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/node_modules/',
    '<rootDir>/packages'
  ],
  collectCoverageFrom: [
    'src/Foundation/Core/**/*.{js,vue}',
    'src/Feature/**/*.{js,vue}',
    'src/Project/**/*.{js,vue}',
    '!build',
    '!src/**/registerServiceWorker.js',
    '!src/**/entry.js',
    '!src/**/common.js',
    '!src/**/entry.development.js',
    '!src/**/entry.production.js',
    '!src/**/index.js',
    '!src/**/polyfills.js',
    '!<rootDir>/node_modules/',
    '!src/Project/Hotfixes/**',
  ],

  setupFiles: [],

  reporters: ['default', 'jest-junit'],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },

  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '\\.(svg)$': '<rootDir>/tasks/jest/transform.svg.js',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.common.js',
    ...config.getJestModulesMapper()     // Important: Map webpack alias automatically
  },
  snapshotSerializers: [
    'jest-serializer-vue'
  ],
  testMatch: [
    '**/src/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testURL: 'http://localhost/'
};
```

Finally, edit your `.nscrc` file and add Vue-cli configuration:

```json
{
  "vueCli": {
     "outputDir": "<themesDir>/<currentWebsite>",
     "scssMixinsPath": "<foundationDir>/Core/code/Styles/mixins/index.scss",
     "baseUrl": {
       "production": "/themes/<currentWebsite>/",
       "development": "/"
     },
     "entries": [
       {
         "mode": "production",
         "name": "bundle",
         "paths": [
           "<projectDir>/<currentWebsite>/code/Scripts/polyfills.js",
           "<projectDir>/<currentWebsite>/code/Scripts/entry.production.js"
         ]
       },
       {
         "mode": "development",
         "name": "bundle",
         "paths": [
           "<projectDir>/<currentWebsite>/code/Scripts/polyfills.js",
           "<projectDir>/<currentWebsite>/code/Scripts/entry.development.js"
         ]
       }
     ],
     "alias": {
       "@Foundation": "<foundationScriptsDir>",
       "@Feature": "<featureDir>",
       "@Project": "<projectDir>",
       "@Themes": "<foundationDir>/Core/code/Styles/"
     }
  }
}
```

> A project example is available on this repository [https://github.com/NodeSitecore/sitecore-vue-boilerplate](https://github.com/NodeSitecore/sitecore-vue-boilerplate).

### Options

- `scssMixinsPath`: Add the scss file which include all of your mixins/variables should be shared with Vue Component.
- `outputDir`: Output directory where the source will be compiled.
- `baseUrl`: Set the base url for the different profile.
- `entries`: Configure the bundle compilation strategies (See Define entries section).
- `alias`: Set alias list for webpack (See Define alias section).

## Getters

## Configuration fields

Key | Default value | Tags | Description
--- | --- | --- | ---
vueCli | `{...}` | Vue-cli, Vue | Return the configuration dedicated to Vue-cli.
entries | `[...]` | Vue-cli, Vue | Entries list which will be compilied by webpack


## Define entries

VueCli configuration accept multiple entries files. Webpack will create different bundles according to your configuration.
Also, each entry can be configured by environment profile (production or development).

Here three possible scenario (production, development and all profile):
```json
{
  "vueCli": {
    "entries": [
      {
        "mode": "production",
        "name": "bundle",
        "paths": [
          "<projectDir>/<currentWebsite>/code/Scripts/polyfills.js",
          "<projectDir>/<currentWebsite>/code/Scripts/entry.production.js"
        ]
      },
      {
        "mode": "development",
        "name": "bundle",
        "paths": [
          "<projectDir>/<currentWebsite>/code/Scripts/polyfills.js",
          "<projectDir>/<currentWebsite>/code/Scripts/entry.development.js"
        ]
      },
      {
        "name": "admin",
        "extractVendors": false,
        "paths": [
          "<projectDir>/<currentWebsite>/code/Scripts/admin.entry.js"
        ]
      }
   ]
  }
}
```

> This example generate two bundles `bundle.js` and `admin.js` but `bundle.js`.

Entry options:

- `mode`: NODE_ENV profile. Indicates for which profile the bundle should be generated
- `name`: Bundle name generated by webpack
- `extractVendors`: Compile NPM module in a separated file (`vendors.bundle.js`). By default `true`.
- `paths`: List of files you want to compile for the bundle.


## Define new alias

Webpack provide a alias mechanism to facilitate javascript module import.
By default, this package provide these following alias:

```
{
  "vueCli": {
    "alias": {
      "@Foundation": "<foundationScriptsDir>",
      "@Feature": "<featureDir>",
      "@Project": "<projectDir>",
      "@Themes": "<foundationDir>/Core/code/Styles/"
    }
  }
}
```

Alias can be used in you Vue and Javascript file like that:

```javascript
import {something} from "@Foundation";
import CarouselModule from "@Feature/Carousel";

// ...
```

## PWA

Vue-cli provide an extension to manage Progressive web application with webpack.
To generate multiple serviceWorker per project/site, you have to configure PWA options in your `vue.config.js`
and edit the `registerServiveWorker.js` generated by Vue-cli.

In `vue.config.js` add this configuration:

```javascript
const config = require('@node-sitecore/config');

const vueConfig = {
  pwa: { // add this
    exclude: [
      /\.map$/,
      /img\/icons\//,
      /manifest\.json$/
    ],
    workboxOptions: {
      swDest: `../../service-worker.${config.currentWebsite}.js`,
      runtimeCaching: []
    }
  }
}

module.exports = config.buildVueConfig(vueConfig);
```

Then in the `registerServiceWorker.js:`

```javascript
/* eslint-disable no-console */
import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  const currentWebsite = process.env.VUE_APP_CURRENT_WEBSITE || 'Common';

  register(`/service-worker.${currentWebsite}.js`, {
    ready() {
      console.log('App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB');
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updated() {
      console.log('New content is available; please refresh.');
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    }
  });
}
```

And finally, edit your nuspec file and add this entry:

```xml
<?xml version="1.0"?>
<package>
 <files>
   <file src="build\Website\service-worker.**.js"/>
 </files>
</package>
```


