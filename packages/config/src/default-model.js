module.exports = () => ({
  /**
   * Current code name of the sitecore website.
   * @tags Sitecore, Vuejs
   */
  currentWebsite: 'Common',
  /**
   * Solution name of the Visual Studio project.
   * @tags Sitecore
   */
  solutionName: 'Base',
  /**
   * Site url use on your local machine. You change this value in a separated file like `.dev.nsrc`.
   * @tags Sitecore
   */
  siteUrl: 'https://base.dev.local',
  /**
   * Directory the Sitecore files instance.
   * @tags Sitecore
   */
  outputDir: '<rootDir>/build',
  /**
   * License path required by Sitecore.
   * @tags Sitecore
   */
  licensePath: '<outputDir>/Data/license.xml',
  /**
   * Auth config file path required by Unicorn task.
   * @tags Unicorn
   */
  authConfigFilePath: '<websiteDir>/App_config/Include/Unicorn/Unicorn.UI.config',
  /**
   * Source code directory.
   * @tags Sitecore
   */
  srcDir: '<rootDir>/src',
  /**
   * Foundation level directory (Helix structure).
   * @tags Sitecore
   */
  foundationDir: '<srcDir>/Foundation',
  /**
   * Scripts Foundation directory. Shortcut to the shared code.
   * @tags Sitecore
   */
  foundationScriptsDir: '<foundationDir>/Core/code/Scripts',
  /**
   * Feature level directory (Helix structure).
   * @tags Sitecore
   */
  featureDir: '<srcDir>/Feature',
  /**
   * Project level directory (Helix structure).
   * @tags Sitecore
   */
  projectDir: '<srcDir>/Project',
  /**
   * Current project directory (Helix structure).
   * @tags Sitecore
   */
  currentProjectDir: '<projectDir>/<currentWebsite>/code',
  /**
   * Website directory used by Sitecore.
   * @tags Sitecore
   */
  websiteDir: '<outputDir>/Website',
  /**
   * Sitecore website config directory
   * @tags Sitecore
   */
  websiteConfigDir: '<websiteDir>/App_Config',
  /**
   * Sitecore views directory.
   * @tags Sitecore
   */
  websiteViewsDir: '<websiteDir>/Views',
  /**
   * Sitecore libraries directory.
   * @tags Sitecore
   */
  websiteLibrariesDir: '<websiteDir>/bin',
  /**
   *
   */
  themesDir: '<websiteDir>/themes',
  /**
   * MsBuild Configuration (Release or Debug).
   * @tags MsBuild
   */
  buildConfiguration: 'Debug',
  /**
   * MsBuild .NET Tools-Version (1.0, 1.1, 2.0, 3.5, 4.0, 12.0, 14.0, 15.0, auto).
   * @tags MsBuild
   */
  buildToolsVersion: '15.0',
  /**
   * Maximal CPU-Count to use. (`-1`: MSBuild Default, `0`: Automatic selection, `> 0`: Concrete value).
   * @tags MsBuild
   */
  buildMaxCpuCount: 0,
  /**
   * Specify the amount of information to display in the build output (`quiet`, `minimal`, `normal`, `detailed`, `diagnostic`).
   * @tags MsBuild
   */
  buildVerbosity: 'minimal',
  /**
   * MsBuild Specify whether to enable or disable the re-use of MSBuild nodes (`true` or `false`).
   * @tags MsBuild
   */
  buildNodeReuse: false,
  /**
   * Logs the MsBuild command that will be executed.
   * @tags MsBuild
   */
  buildLogCommand: false,
  /**
   * Exclude files from the deployment on the Sitecore instance.
   * @tags MsBuild
   */
  excludeFilesFromDeployment: ['packages.config'],

  // build
  /**
   * Build targets options (`Build`, `Clean`, `Rebuild`).
   * @tags MsBuild
   */
  buildTargets: ['Build'],
  /**
   * Build all solutions or/and projects. Support glob patterns.
   * @tags MsBuild
   */
  buildPaths: ['<solutionPath>'],
  /**
   * Build platform (e.g. x86, x64, Any CPU).
   * @tags MsBuild
   */
  buildPlatform: 'Any CPU',
  /**
   * Additional build properties.
   * @tags MsBuild
   */
  buildProperties: {},

  // publish
  /**
   * Publish targets options (`Build`, `Clean`, `Rebuild`).
   * @tags MsBuild
   */
  publishTargets: ['Build'],
  /**
   * Publish all solutions or/and projects. Support glob patterns.
   */
  publishPaths: ['<solutionPath>'],
  /**
   * Publish platform (e.g. x86, x64, AnyCpu).
   * @tags MsBuild
   */
  publishPlatform: 'AnyCpu',
  /**
   * Additional publish properties.
   * @tags MsBuild
   */
  publishProperties: {
    DeployOnBuild: 'true',
    DeployDefaultTarget: 'WebPublish',
    WebPublishMethod: 'FileSystem',
    DeleteExistingFiles: 'false',
    _FindDependencies: 'false'
  }
});
