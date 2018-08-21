# NodeSitecore Config

[![Build Status](https://travis-ci.org/NodeSitecore/sitecore-config.svg?branch=master)](https://travis-ci.org/NodeSitecore/sitecore-config)
[![Coverage Status](https://coveralls.io/repos/github/NodeSitecore/sitecore-config/badge.svg?branch=master)](https://coveralls.io/github/NodeSitecore/sitecore-config?branch=master)
[![Package Quality](http://npm.packagequality.com/badge/@node-sitecore/config.png)](http://packagequality.com/#?package=@node-sitecore/config)
[![npm version](https://badge.fury.io/js/%40node-sitecore%2Fconfig.svg)](https://badge.fury.io/js/%40node-sitecore%2Fconfig)
[![Dependencies](https://david-dm.org/NodeSitecore/sitecore-config.svg)](https://david-dm.org/NodeSitecore/sitecore-config#info=dependencies)
[![img](https://david-dm.org/NodeSitecore/sitecore-config/dev-status.svg)](https://david-dm.org/NodeSitecore/sitecore-config/#info=devDependencies)
[![img](https://david-dm.org/NodeSitecore/sitecore-config/peer-status.svg)](https://david-dm.org/NodeSitecore/sitecore-config/#info=peerDependenciess)
[![Known Vulnerabilities](https://snyk.io/test/github/NodeSitecore/sitecore-config/badge.svg)](https://snyk.io/test/github/NodeSitecore/sitecore-config)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> A shared configuration between all packages based on `@node-sitecore/cli`.

## Features

- Control over configuration values.
- Support multiple configuration files by environment (.nscrc (default), .development.nscrc, .test.nscrc, .production.nscrc).
- All value can be overridden by env or args variable ([nconf](https://github.com/indexzero/nconf))
- Extensible with plugins.

## Installation

```bash
$ npm install @node-sitecore/config --save-dev
```

## Documentation

A documentation is available about differents default options supported by `@node-sitecore/config`
[here](https://NodeSitecore.github.io/sitecore-cli/usage/configuration).

## Example Usage

In node.js:
```javascript
const config = require('@node-sitecore/config');

// getters
console.log(config.currentWebsite) // Custom
console.log(config.websiteDir) // build/Website

// get()

console.log(config.get('customObj')) // Object {attr1: "value1", ...}

// or

console.log(config.get('customObj:attr1') // bundle

// has()
console.log(config.has('customObj:attr1')) // true


// set()
config.set('customObj:attr1', "new value");

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
```

> Note: API is documented on our website [here](https://NodeSitecore.github.io/sitecore-cli/usage/configuration).

## Contributing

Read our [contribution documentation](https://NodeSitecore.github.io/sitecore-cli/CONTRIBUTING.md).

## License

The MIT License (MIT)

Copyright (c) 2018 NodeSitecore

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis]: https://travis-ci.org/
