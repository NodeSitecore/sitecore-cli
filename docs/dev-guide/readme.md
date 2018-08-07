# Introduction <Badge text="3.0.0+" />
## Core Concepts

There are two major parts of the system:

 - `@node-sitecore/config`: A shared extensible configuration for all packages based on `nconf` and load `.nscrc` file,
 - `@node-sitecore/cli`: Expose the `nsc` commands.

Both utilize a plugin-based architecture.

### ConfigService

ConfigService is the class responsible to load Config plugins packages.

Read our documentation about [how to develop a Config plugins](/dev-guide/config-plugins.md).

### CliService

ConfigService is the class responsible to load CLI plugins packages.

Read our documentation about [how to develop a CLI plugins](/dev-guide/cli-plugins.md).
