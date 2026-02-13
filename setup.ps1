#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Setup script for the Azure Foundry Model Router Demo App.

.DESCRIPTION
    Validates prerequisites, installs dependencies, configures environment
    variables, and optionally starts the development server.

.EXAMPLE
    .\setup.ps1
    .\setup.ps1 -SkipEnv
    .\setup.ps1 -StartDev
#>

[CmdletBinding()]
param(
    [switch]$SkipEnv,
    [switch]$StartDev
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ── Colours / helpers ────────────────────────────────────────────────────────
function Write-Step  { param([string]$Msg) Write-Host "`n▶  $Msg" -ForegroundColor Cyan }
function Write-Ok    { param([string]$Msg) Write-Host "   ✔ $Msg" -ForegroundColor Green }
function Write-Warn  { param([string]$Msg) Write-Host "   ⚠ $Msg" -ForegroundColor Yellow }
function Write-Fail  { param([string]$Msg) Write-Host "   ✘ $Msg" -ForegroundColor Red }

# ── Banner ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║   Azure Foundry Model Router Demo — Setup                   ║" -ForegroundColor Magenta
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta

# ── 1. Check Node.js ─────────────────────────────────────────────────────────
Write-Step "Checking Node.js..."
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Fail "Node.js is not installed."
    Write-Host "   Install from https://nodejs.org (LTS recommended)." -ForegroundColor Yellow
    exit 1
}
$nodeVersion = (node --version).TrimStart('v')
$major = [int]($nodeVersion.Split('.')[0])
if ($major -lt 18) {
    Write-Fail "Node.js v$nodeVersion detected. v18 or later is required."
    exit 1
}
Write-Ok "Node.js v$nodeVersion"

# ── 2. Check npm ─────────────────────────────────────────────────────────────
Write-Step "Checking npm..."
$npm = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npm) {
    Write-Fail "npm is not installed."
    exit 1
}
$npmVersion = npm --version
Write-Ok "npm v$npmVersion"

# ── 3. Install dependencies ─────────────────────────────────────────────────
Write-Step "Installing dependencies..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Fail "npm install failed."
    exit 1
}
Write-Ok "Dependencies installed"

# ── 4. Environment variables ────────────────────────────────────────────────
if (-not $SkipEnv) {
    Write-Step "Configuring environment variables..."
    $envFile = Join-Path $PSScriptRoot '.env.local'
    $envExample = Join-Path $PSScriptRoot '.env.example'

    if (Test-Path $envFile) {
        Write-Ok ".env.local already exists — skipping."
    }
    elseif (Test-Path $envExample) {
        Copy-Item $envExample $envFile
        Write-Warn ".env.local created from .env.example."
        Write-Host "   → Edit .env.local and add your Azure API keys before running the app." -ForegroundColor Yellow
    }
    else {
        Write-Warn ".env.example not found. Create a .env.local manually with your API keys."
    }
}

# ── 5. Validate TypeScript compilation ───────────────────────────────────────
Write-Step "Validating TypeScript..."
npx tsc --noEmit 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Ok "TypeScript compiles cleanly"
}
else {
    Write-Warn "TypeScript reported errors (non-blocking). Run 'npx tsc --noEmit' for details."
}

# ── 6. Summary ───────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   Setup complete!                                           ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  Quick-start commands:" -ForegroundColor White
Write-Host "    npm run dev       Start the dev server" -ForegroundColor Gray
Write-Host "    npm run build     Production build" -ForegroundColor Gray
Write-Host "    npm run lint      Run ESLint" -ForegroundColor Gray
Write-Host "    npm run preview   Preview production build" -ForegroundColor Gray
Write-Host ""

# ── 7. Optionally start dev server ──────────────────────────────────────────
if ($StartDev) {
    Write-Step "Starting development server..."
    npm run dev
}
