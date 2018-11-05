
# NodeSitecore/keysitecore

> Original project: https://www.npmjs.com/package/key-sitecore-vue-plugin

In Editor Content of a siteCore project, they use jquery upon key dom attribute. Unfortunately key is also used by Vue and remove from dom element .

This plugin reset the key attributes in dom element on mounted time.

## Installation

Run npm install:
```bash
$ npm install @node-sitecore/keysitecore
```

And import KeySitecore in your Vue project:

```javascript
import * as KeySitecore from "@node-sitecore/keysitecore";

Vue.use(KeySitecore);
```