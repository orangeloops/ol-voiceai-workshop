#!/bin/bash

# Workshop Requirements Verification Script
# For macOS and Linux

echo "🔍 Verifying Workshop requirements..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Error counter
ERRORS=0

# Function to check commands
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $2 installed"
        if [ ! -z "$3" ]; then
            VERSION=$($3 2>&1)
            echo "  Version: $VERSION"
        fi
        return 0
    else
        echo -e "${RED}✗${NC} $2 NOT found"
        echo -e "  ${YELLOW}→${NC} Install from: $4"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

echo "═══════════════════════════════════════════════"
echo "  1. Docker Desktop"
echo "═══════════════════════════════════════════════"
if check_command "docker" "Docker" "docker --version" "https://www.docker.com/products/docker-desktop/"; then
    # Check if Docker is running
    if docker info &> /dev/null; then
        echo -e "${GREEN}✓${NC} Docker Desktop is running"
    else
        echo -e "${YELLOW}⚠${NC} Docker is installed but NOT running"
        echo -e "  ${YELLOW}→${NC} Please start Docker Desktop before running 'docker compose up'"
    fi
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  2. Git"
echo "═══════════════════════════════════════════════"
check_command "git" "Git" "git --version" "https://git-scm.com/downloads"
echo ""

echo "═══════════════════════════════════════════════"
echo "  3. Visual Studio Code (optional)"
echo "═══════════════════════════════════════════════"
if command -v code &> /dev/null; then
    echo -e "${GREEN}✓${NC} VS Code installed"
    VERSION=$(code --version 2>&1 | head -n 1)
    echo "  Version: $VERSION"
elif [ -d "/Applications/Visual Studio Code.app" ]; then
    echo -e "${GREEN}✓${NC} VS Code installed (application detected)"
    echo -e "  ${YELLOW}ℹ${NC} The 'code' command is not in PATH"
    echo -e "  ${YELLOW}→${NC} To add 'code' to PATH: Open VS Code → Command Palette (⇧⌘P) → 'Shell Command: Install code command in PATH'"
else
    echo -e "${YELLOW}ℹ${NC} VS Code not detected"
    echo -e "  ${YELLOW}ℹ${NC} VS Code is recommended but not required"
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  4. .env file"
echo "═══════════════════════════════════════════════"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
else
    echo -e "${RED}✗${NC} .env file does NOT exist"
    echo -e "  ${YELLOW}→${NC} Run: cp .env.example .env"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  Summary"
echo "═══════════════════════════════════════════════"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All set for the workshop!${NC}"
    echo ""
    echo "Next step:"
    echo "  docker compose up --build"
else
    echo -e "${RED}✗ Found $ERRORS problem(s)${NC}"
    echo ""
    echo "Please resolve the issues indicated above before continuing."
fi
echo ""
