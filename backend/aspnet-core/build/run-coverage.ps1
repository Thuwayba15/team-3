param(
    [string]$Configuration = "Debug"
)

$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDirectory "..")
$resultsDirectory = Join-Path $projectRoot "TestResults/Coverage"

if (Test-Path $resultsDirectory) {
    Remove-Item -Path $resultsDirectory -Recurse -Force
}

Write-Host "Running backend coverage..."

dotnet test (Join-Path $projectRoot "Team3.sln") `
    --configuration $Configuration `
    --collect:"XPlat Code Coverage" `
    --results-directory $resultsDirectory

$coverageFiles = Get-ChildItem -Path $resultsDirectory -Recurse -Filter "coverage.cobertura.xml"

if ($coverageFiles.Count -eq 0) {
    throw "No coverage.cobertura.xml files were produced."
}

Write-Host "Coverage files generated:"
$coverageFiles | ForEach-Object { Write-Host " - $($_.FullName)" }
