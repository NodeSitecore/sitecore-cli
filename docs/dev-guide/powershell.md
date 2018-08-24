# PowerShell <Badge text="3.0.0+" />
## Introduction

CLI provide you a command to run a PowerShell script and expose resolved configuration from your `.nscrc` configuration file.

Here is an example of structure folder:
```
.
└── ns-project (project)
    ├── build/
    ├── package.json
    ├── Install.ps1
    └── .nscrc
```

The target here, is to use CLI to run Install.ps1 and use configuration from `.nscrc` file.

Here the content of the PowerShell script:
```powershell
param([object]$nscConfig)

Write-Host ($nscConfig | Format-List | Out-String)
```

Now we can run this script with CLI like this:

```bash
nsc ps ./Install.ps1
```

Output:
```bash
currentWebsite             : Base
solutionName               : Base
siteUrl                    : https://base.dev.local
outputDir                  : C:\path\to\\to\build
licensePath                : C:\path\to\build\Website\App_Data
authConfigFilePath         : C:\path\to\build\Website\App_config\Include\Unicorn\Unicorn.UI.config
srcDir                     : C:\path\to\src
foundationDir              : C:\path\to\src\Foundation
foundationScriptsDir       : C:\path\to\src\Foundation\Core\code\Scripts
featureDir                 : C:\path\to\src\Feature
projectDir                 : C:\path\to\src\Project
currentProjectDir          : C:\path\to\src\Project\Base\code
websiteDir                 : C:\path\to\build\Website
websiteConfigDir           : C:\path\to\build\Website\App_Config
websiteViewsDir            : C:\path\to\build\Website\Views
websiteLibrariesDir        : C:\path\to\build\Website\bin
themesDir                  : C:\path\to\build\Website\themes
buildConfiguration         : Debug
buildToolsVersion          : 15.0
buildMaxCpuCount           : 0
buildVerbosity             : minimal
buildNodeReuse             : False
buildLogCommand            : False
excludeFilesFromDeployment : {packages.config}
buildTargets               : {Build}
buildPaths                 : {C:\path\to\Base.sln}
buildPlatform              : Any CPU
buildProperties            :
publishTargets             : {Build}
publishPaths               : {C:\path\to\Base.sln}
publishPlatform            : Any Cpu
publishProperties          : @{DeployOnBuild=true;
                             DeployDefaultTarget=WebPublish;
                             WebPublishMethod=FileSystem;
                             DeleteExistingFiles=false; _FindDependencies=false}
scriptPaths                :
scssPaths                  : {}
bundle                     : @{cssBundleName=bundle.css; jsBundleName=bundle.js; jsMapName=bundle.map.js}
autoPrefixerBrowsers       : {last 2 versions, ie >= 10, Safari >= 9, iOS >= 8}
````

## Forwarding parameters

CLI accept any extra command line options (parameters), that will automatically forwarded to the PowerShell script.

For example:
```bash
nsc ps ./Install.ps1 --Test value
```
The `--Test value` option will be forwarded to the PowerShell script and can be retrieve as following:

```powershell
param([object]$nscConfig, [string] $Test)

Write-Host ($nscConfig | Format-List | Out-String)

Write-Host $Test
```