const config = require('@node-sitecore/config');

module.exports = (parameters = {}) => {
  const { process, type = 'solution', paths = [] } = parameters;
  if (paths && paths.length) {
    return paths;
  }
  switch (type) {
    case 'all':
    case 'solution':
    default:
      return process === 'build' ? config.buildPaths : config.publishPaths;

    case 'Foundation':
      paths.push(`${config.foundationRoot}/**/code/*.csproj`);
      break;

    case 'Feature':
      paths.push(`${config.featureRoot}/**/code/*.csproj`);
      break;

    case 'Project':
      paths.push(`${config.projectRoot}/**/code/*.csproj`);
      break;
  }

  return paths;
};
