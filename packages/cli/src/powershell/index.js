const execa = require('execa');
const config = require('@node-sitecore/config');

module.exports = {
  exec(script, args = [], options = {}) {
    const nscConfig = config.toObject();

    const child = execa.shell(
      `powershell -executionpolicy unrestricted "${script} ${args.join(' ')} -nscConfig (ConvertFrom-Json -InputObject $Env:NSC_CONFIG)"`,
      {
        cwd: process.cwd(),
        maxBuffer: 1024 * 500,
        stdio: 'inherit',
        env: {
          NSC_CONFIG: JSON.stringify(nscConfig)
        },
        ...options
      }
    );

    return child;
  }
};
