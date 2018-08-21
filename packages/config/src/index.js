const ConfigService = require('./service');

const service = new ConfigService(process.env.NSC_CONF_CONTEXT || process.cwd());

module.exports = service.config;
