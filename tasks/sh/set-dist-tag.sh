#!/usr/bin/env sh

# abort on errors
set -e

tag=$2;

eval "npm dist-tag rm @node-sitecore/config@$1 $tag"
eval "npm dist-tag rm @node-sitecore/config-browserify@$1 $tag"
eval "npm dist-tag rm @node-sitecore/cli@$1 $tag"
eval "npm dist-tag rm @node-sitecore/cli-plugin-fractal@$1 $tag"
eval "npm dist-tag rm @node-sitecore/cli-plugin-vue@$1 $tag"
eval "npm dist-tag rm @node-sitecore/cli-plugin-browsersync@$1 $tag"
