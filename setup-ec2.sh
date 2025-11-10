#!/bin/bash

# EC2 Deployment Script
# This script sets up the workshop application on an AWS EC2 instance

set -e

echo "🚀 Starting EC2 Deployment Setup..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}❌ Please do not run this script as root${NC}"
   exit 1
fi

echo "═══════════════════════════════════════════════"
echo "  Step 1: Update System"
echo "═══════════════════════════════════════════════"
sudo apt-get update -y
sudo apt-get upgrade -y
echo -e "${GREEN}✓${NC} System updated"
echo ""

echo "═══════════════════════════════════════════════"
echo "  Step 2: Install Docker"
echo "═══════════════════════════════════════════════"
if command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠${NC} Docker already installed"
else
    # Install Docker
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✓${NC} Docker installed"
    echo -e "${YELLOW}⚠${NC} You may need to log out and back in for docker group permissions to take effect"
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  Step 3: Install Git"
echo "═══════════════════════════════════════════════"
if command -v git &> /dev/null; then
    echo -e "${YELLOW}⚠${NC} Git already installed"
else
    sudo apt-get install -y git
    echo -e "${GREEN}✓${NC} Git installed"
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  Step 4: Clone Repository"
echo "═══════════════════════════════════════════════"
if [ -d "ol-boston-workshop" ]; then
    echo -e "${YELLOW}⚠${NC} Repository already exists"
    cd ol-boston-workshop
    git pull
else
    git clone https://github.com/luciadeoliveira-orangeloops/ol-boston-workshop.git
    cd ol-boston-workshop
    echo -e "${GREEN}✓${NC} Repository cloned"
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  Step 5: Configure Environment"
echo "═══════════════════════════════════════════════"
if [ ! -f ".env" ]; then
    cp .env.production.example .env
    echo -e "${GREEN}✓${NC} Environment file created from .env.production.example"
    echo -e "${YELLOW}⚠${NC} IMPORTANT: Edit .env file with your production values:"
    echo "  - Change POSTGRES_PASSWORD"
    echo "  - Add NEXT_PUBLIC_ELEVENLABS_WIDGET_SRC (if using ElevenLabs)"
    echo "  - Add NEXT_PUBLIC_ELEVENLABS_AGENT_ID (if using ElevenLabs)"
    echo ""
    echo -e "${BLUE}Run: nano .env${NC}"
else
    echo -e "${YELLOW}⚠${NC} .env file already exists"
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  Step 6: Configure Firewall"
echo "═══════════════════════════════════════════════"
echo "Make sure your EC2 Security Group allows:"
echo "  - Port 4000 (MCP Server) - for ElevenLabs webhook"
echo "  - Port 3000 (Frontend) - optional, for web interface"
echo "  - Port 22 (SSH) - for remote access"
echo ""
echo "You can configure this in AWS Console:"
echo "EC2 → Security Groups → Inbound Rules"
echo ""

echo "═══════════════════════════════════════════════"
echo "  Step 7: Start Application"
echo "═══════════════════════════════════════════════"
echo "To start the application, run:"
echo -e "${BLUE}docker compose -f docker-compose.prod.yml up -d --build${NC}"
echo ""
echo "To view logs:"
echo -e "${BLUE}docker compose -f docker-compose.prod.yml logs -f${NC}"
echo ""
echo "To stop the application:"
echo -e "${BLUE}docker compose -f docker-compose.prod.yml down${NC}"
echo ""

echo "═══════════════════════════════════════════════"
echo "  Step 8: Get Your Public URL"
echo "═══════════════════════════════════════════════"
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "Unable to fetch")
if [ "$PUBLIC_IP" != "Unable to fetch" ]; then
    echo -e "${GREEN}✓${NC} Your EC2 Public IP: $PUBLIC_IP"
    echo ""
    echo "Your MCP Server will be available at:"
    echo -e "${BLUE}http://$PUBLIC_IP:4000${NC}"
    echo ""
    echo "Your Frontend will be available at:"
    echo -e "${BLUE}http://$PUBLIC_IP:3000${NC}"
else
    echo -e "${YELLOW}⚠${NC} Could not fetch public IP. Get it from AWS Console."
fi
echo ""

echo "═══════════════════════════════════════════════"
echo "  Setup Complete!"
echo "═══════════════════════════════════════════════"
echo -e "${GREEN}✓${NC} EC2 setup is ready"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your production settings"
echo "2. Configure EC2 Security Group to allow ports 3000 and 4000"
echo "3. Start the application with: docker compose -f docker-compose.prod.yml up -d --build"
echo "4. Use http://YOUR_EC2_IP:4000 as your webhook URL in ElevenLabs"
echo ""
