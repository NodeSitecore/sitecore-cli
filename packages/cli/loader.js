const CliService = require('./src/service.js');

module.exports = new CliService(process.env.NSC_CLI_CONTEXT || process.cwd());
