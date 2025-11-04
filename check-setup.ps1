# Script de verificación de requisitos para el Workshop
# Para Windows PowerShell

Write-Host "🔍 Verificando requisitos del Workshop..." -ForegroundColor Cyan
Write-Host ""

# Contador de errores
$script:Errors = 0

# Función para verificar comandos
function Check-Command {
    param(
        [string]$Command,
        [string]$Name,
        [string]$VersionCommand,
        [string]$DownloadUrl
    )
    
    try {
        $null = Get-Command $Command -ErrorAction Stop
        Write-Host "✓ $Name instalado" -ForegroundColor Green
        
        if ($VersionCommand) {
            $version = Invoke-Expression $VersionCommand 2>&1
            Write-Host "  Versión: $version" -ForegroundColor Gray
        }
        return $true
    }
    catch {
        Write-Host "✗ $Name NO encontrado" -ForegroundColor Red
        Write-Host "  → Instalar desde: $DownloadUrl" -ForegroundColor Yellow
        $script:Errors++
        return $false
    }
}

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "  1. Docker Desktop" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray

if (Check-Command "docker" "Docker" "docker --version" "https://www.docker.com/products/docker-desktop/") {
    # Verificar si Docker está corriendo
    try {
        docker info 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Docker Desktop está corriendo" -ForegroundColor Green
        }
        else {
            Write-Host "⚠ Docker está instalado pero NO está corriendo" -ForegroundColor Yellow
            Write-Host "  → Por favor inicia Docker Desktop antes de ejecutar 'docker compose up'" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "⚠ No se pudo verificar el estado de Docker" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "  2. Git" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Check-Command "git" "Git" "git --version" "https://git-scm.com/downloads" | Out-Null
Write-Host ""

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "  3. Visual Studio Code (opcional)" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
if (-not (Check-Command "code" "VS Code" "code --version" "https://code.visualstudio.com/")) {
    # Verificar si VS Code está instalado en ubicaciones comunes
    $vscodeInstalled = $false
    $vscodePaths = @(
        "$env:LOCALAPPDATA\Programs\Microsoft VS Code\Code.exe",
        "$env:ProgramFiles\Microsoft VS Code\Code.exe",
        "$env:ProgramFiles(x86)\Microsoft VS Code\Code.exe"
    )
    
    foreach ($path in $vscodePaths) {
        if (Test-Path $path) {
            Write-Host "✓ VS Code instalado (aplicación detectada)" -ForegroundColor Green
            Write-Host "  ℹ El comando 'code' no está en PATH pero VS Code está instalado" -ForegroundColor Yellow
            Write-Host "  → Para agregar 'code' al PATH: Abre VS Code → Command Palette (Ctrl+Shift+P) → 'Shell Command: Install code command in PATH'" -ForegroundColor Yellow
            $vscodeInstalled = $true
            $script:Errors--
            break
        }
    }
    
    if (-not $vscodeInstalled) {
        Write-Host "  ℹ VS Code no detectado" -ForegroundColor Yellow
        Write-Host "  ℹ VS Code es recomendado pero no obligatorio" -ForegroundColor Yellow
        $script:Errors--
    }
}
Write-Host ""

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "  4. Archivo .env" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray

if (Test-Path ".env") {
    Write-Host "✓ Archivo .env existe" -ForegroundColor Green
    
    # Verificar variables importantes
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match "NGROK_AUTHTOKEN=(.*)") {
        $ngrokToken = $matches[1].Trim()
        
        if ([string]::IsNullOrEmpty($ngrokToken) -or $ngrokToken -eq "your_ngrok_token_here") {
            Write-Host "⚠ NGROK_AUTHTOKEN no está configurado" -ForegroundColor Yellow
            Write-Host "  → Obtén tu token en: https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor Yellow
            $script:Errors++
        }
        else {
            Write-Host "✓ NGROK_AUTHTOKEN configurado" -ForegroundColor Green
        }
    }
    else {
        Write-Host "⚠ NGROK_AUTHTOKEN no encontrado en .env" -ForegroundColor Yellow
        $script:Errors++
    }
}
else {
    Write-Host "✗ Archivo .env NO existe" -ForegroundColor Red
    Write-Host "  → Ejecuta: copy .env.example .env" -ForegroundColor Yellow
    $script:Errors++
}
Write-Host ""

Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray
Write-Host "  Resumen" -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Gray

if ($script:Errors -eq 0) {
    Write-Host "✓ ¡Todo listo para el workshop!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Siguiente paso:" -ForegroundColor White
    Write-Host "  docker compose up --build" -ForegroundColor Cyan
}
else {
    Write-Host "✗ Encontrados $($script:Errors) problema(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor resuelve los problemas indicados arriba antes de continuar." -ForegroundColor Yellow
}
Write-Host ""
