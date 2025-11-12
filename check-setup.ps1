# Workshop Requirements Verification Script
# For Windows PowerShell

Write-Host "🔍 Verifying Workshop requirements..." -ForegroundColor Cyan
Write-Host ""

# Error counter
$script:Errors = 0

# Function to check commands
function Check-Command {
    param(
        [string]$Command,
        [string]$Name,
        [string]$VersionCommand,
        [string]$DownloadUrl
    )
    
    try {
        $null = Get-Command $Command -ErrorAction Stop
        Write-Host "✓ $Name installed" -ForegroundColor Green
        
        if ($VersionCommand) {
            $version = Invoke-Expression $VersionCommand 2>&1
            Write-Host "  Version: $version" -ForegroundColor Gray
        }
        return $true
    }
    catch {
        Write-Host "✗ $Name NOT found" -ForegroundColor Red
        Write-Host "  → Install from: $DownloadUrl" -ForegroundColor Yellow
        $script:Errors++
        return $false
    }
}

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "  1. Docker Desktop" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray

if (Check-Command "docker" "Docker" "docker --version" "https://www.docker.com/products/docker-desktop/") {
    # Check if Docker is running
    try {
        docker info 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Docker Desktop is running" -ForegroundColor Green
        }
        else {
            Write-Host "⚠ Docker is installed but NOT running" -ForegroundColor Yellow
            Write-Host "  → Please start Docker Desktop before running 'docker compose up'" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "⚠ Could not verify Docker status" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "  2. Git" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Check-Command "git" "Git" "git --version" "https://git-scm.com/downloads" | Out-Null
Write-Host ""

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "  3. Visual Studio Code (optional)" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
if (-not (Check-Command "code" "VS Code" "code --version" "https://code.visualstudio.com/")) {
    # Check if VS Code is installed in common locations
    $vscodeInstalled = $false
    $vscodePaths = @(
        "$env:LOCALAPPDATA\Programs\Microsoft VS Code\Code.exe",
        "$env:ProgramFiles\Microsoft VS Code\Code.exe",
        "$env:ProgramFiles(x86)\Microsoft VS Code\Code.exe"
    )
    
    foreach ($path in $vscodePaths) {
        if (Test-Path $path) {
            Write-Host "✓ VS Code installed (application detected)" -ForegroundColor Green
            Write-Host "  ℹ The 'code' command is not in PATH" -ForegroundColor Yellow
            Write-Host "  → To add 'code' to PATH: Open VS Code → Command Palette (Ctrl+Shift+P) → 'Shell Command: Install code command in PATH'" -ForegroundColor Yellow
            $vscodeInstalled = $true
            $script:Errors--
            break
        }
    }
    
    if (-not $vscodeInstalled) {
        Write-Host "  ℹ VS Code not detected" -ForegroundColor Yellow
        Write-Host "  ℹ VS Code is recommended but not required" -ForegroundColor Yellow
        $script:Errors--
    }
}
Write-Host ""

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "  4. .env file" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray

if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
}
else {
    Write-Host "✗ .env file does NOT exist" -ForegroundColor Red
    Write-Host "  → Run: copy .env.example .env" -ForegroundColor Yellow
    $script:Errors++
}
Write-Host ""

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "  Summary" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray

if ($script:Errors -eq 0) {
    Write-Host "✓ All set for the workshop!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step:" -ForegroundColor White
    Write-Host "  docker compose up --build" -ForegroundColor Cyan
}
else {
    Write-Host "✗ Found $($script:Errors) problem(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please resolve the issues indicated above before continuing." -ForegroundColor Yellow
}
Write-Host ""
