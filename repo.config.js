module.exports = {
  npmScope: '@node-sitecore',
  npmAccess: 'public',
  versionPlaceholder: '0.0.0-PLACEHOLDER',
  packagesDir: './packages',
  outputDir: './dist',
  ignorePublishPackages: [],

  pkgTemplate: (pkgName, { repository, bugs, author, license, gitHead, contributors }) => ({
    main: 'src/index.js',
    repository,
    bugs,
    homepage: `https://github.com/NodeSitecore/sitecore-cli/packages/${pkgName}`,
    author,
    contributors,
    license,
    gitHead
  })
};
