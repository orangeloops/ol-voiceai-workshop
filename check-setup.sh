#!/bin/bash

# Script de verificación de requisitos para el Workshop
# Para macOS y Linux

echo "🔍 Verificando requisitos del Workshop..."
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de errores
ERRORS=0

# Función para verificar comandos
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2 instalado"
        if [ ! -z "$3" ]; then
            VERSION=$($3 2>&1)
            echo "  Versión: $VERSION"
        fi
        return 0
    else
        echo -e "${RED}✗${NC} $2 NO encontrado"
        echo -e "  ${YELLOW}→${NC} Instalar desde: $4"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

echo "═══════════════════════════════════════════════"
echo "  1. Docker Desktop"
echo "═══════════════════════════════════════════════"
if check_command "docker" "Docker" "docker --version" "https://www.docker.com/products/docker-desktop/"; then
    # Verificar si Docker está corriendo
    if docker info &> /dev/null; then
        echo -e "${GREEN}✓${NC} Docker Desktop está corriendo"
    else
        echo -e "${YELLOW}⚠${NC} Docker está instalado pero NO está corriendo"
        echo -e "  ${YELLOW}→${NC} Por favor inicia Docker Desktop antes de ejecutar 'docker compose up'"
    fi
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  2. Git"
echo "═══════════════════════════════════════════════"
check_command "git" "Git" "git --version" "https://git-scm.com/downloads"
echo ""

echo "═══════════════════════════════════════════════"
echo "  3. Visual Studio Code (opcional)"
echo "═══════════════════════════════════════════════"
if command -v code &> /dev/null; then
    echo -e "${GREEN}✓${NC} VS Code instalado"
    VERSION=$(code --version 2>&1 | head -n 1)
    echo "  Versión: $VERSION"
elif [ -d "/Applications/Visual Studio Code.app" ]; then
    echo -e "${GREEN}✓${NC} VS Code instalado (aplicación detectada)"
    echo -e "  ${YELLOW}ℹ${NC} El comando 'code' no está en PATH"
    echo -e "  ${YELLOW}→${NC} Para agregar 'code' al PATH: Abre VS Code → Command Palette (⇧⌘P) → 'Shell Command: Install code command in PATH'"
else
    echo -e "${YELLOW}ℹ${NC} VS Code no detectado"
    echo -e "  ${YELLOW}ℹ${NC} VS Code es recomendado pero no obligatorio"
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  4. Archivo .env"
echo "═══════════════════════════════════════════════"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} Archivo .env existe"
    
    # Verificar variables importantes
    if grep -q "NGROK_AUTHTOKEN=" .env; then
        NGROK_TOKEN=$(grep "NGROK_AUTHTOKEN=" .env | cut -d '=' -f2)
        if [ -z "$NGROK_TOKEN" ] || [ "$NGROK_TOKEN" = "your_ngrok_token_here" ]; then
            echo -e "${YELLOW}⚠${NC} NGROK_AUTHTOKEN no está configurado"
            echo -e "  ${YELLOW}→${NC} Obtén tu token en: https://dashboard.ngrok.com/get-started/your-authtoken"
            ERRORS=$((ERRORS + 1))
        else
            echo -e "${GREEN}✓${NC} NGROK_AUTHTOKEN configurado"
        fi
    else
        echo -e "${YELLOW}⚠${NC} NGROK_AUTHTOKEN no encontrado en .env"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} Archivo .env NO existe"
    echo -e "  ${YELLOW}→${NC} Ejecuta: cp .env.example .env"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  Resumen"
echo "═══════════════════════════════════════════════"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ ¡Todo listo para el workshop!${NC}"
    echo ""
    echo "Siguiente paso:"
    echo "  docker compose up --build"
else
    echo -e "${RED}✗ Encontrados $ERRORS problema(s)${NC}"
    echo ""
    echo "Por favor resuelve los problemas indicados arriba antes de continuar."
fi
echo ""
