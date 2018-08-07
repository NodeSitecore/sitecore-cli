param([string]$url, [string]$configUrl, [string]$secret)
$ErrorActionPreference = 'Stop'

$ScriptPath = Split-Path $MyInvocation.MyCommand.Path

# This is an example PowerShell script that will remotely execute a Unicorn sync using the new CHAP authentication system.

Import-Module $ScriptPath\Unicorn.psm1

# SYNC SPECIFIC CONFIGURATION
GetConfig-Unicorn -ControlPanelUrl $url -GetConfigUrl $configUrl  -SharedSecret $secret