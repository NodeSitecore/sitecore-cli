/* eslint-disable global-require */
const path = require('path');
const { matchesPluginId } = require('./utils/plugin-resolution');

// Note: if a plugin-registered command needs to run in a specific default mode,
// the plugin needs to expose it via `module.exports.defaultModes` in the form
// of { [commandName]: mode }. This is because the command mode needs to be
// known and applied before loading user options / applying plugins.

class PluginAPI {
  /**
   * @param {string} id - Id of the plugin.
   * @param {CliService} service - A vue-cli-service instance.
   */
  constructor(id, service) {
    this.id = id;
    this.service = service;
  }

  /**
   * Current working directory.
   */
  getCwd() {
    return this.service.context;
  }

  /**
   * Resolve path for a project.
   *
   * @param {string} _path - Relative path from project root
   * @return {string} The resolved absolute path.
   */
  resolve(_path) {
    return path.resolve(this.service.context, _path);
  }

  /**
   * Check if the project has a given plugin.
   *
   * @param {string} id - Plugin id, can omit the (@vue/|vue-|@scope/vue)-cli-plugin- prefix
   * @return {boolean}
   */
  hasPlugin(id) {
    return this.service.plugins.some(p => matchesPluginId(id, p.id));
  }

  /**
   * Register a command that will become available as `vue-cli-service [name]`.
   *
   * @param {string} name
   * @param {object} [opts]
   *   {
   *     description: string,
   *     usage: string,
   *     options: { [string]: string }
   *   }
   * @param {function} fn
   *   (args: { [string]: string }, rawArgs: string[]) => ?Promise
   */
  registerCommand(name, opts, fn) {
    /* istanbul ignore next */
    if (typeof opts === 'function') {
      fn = opts;
      opts = null;
    }
    this.service.commands[name] = { fn, opts: opts || {} };
  }
}

module.exports = PluginAPI;
