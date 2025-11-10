# 🚀 AWS EC2 Deployment Guide

This guide will help you deploy the workshop application to an AWS EC2 instance, eliminating the need for ngrok.

---

## 📋 Prerequisites

Before starting, make sure you have:

- An AWS account with EC2 access
- An EC2 instance running Ubuntu 20.04 or later (recommended: t2.medium or better)
- SSH access to your EC2 instance
- ElevenLabs account (for voice agent)

---

## 🔧 EC2 Instance Setup

### **Step 1: Create and Configure EC2 Instance**

1. **Launch EC2 Instance**:
   - Go to AWS Console → EC2 → Launch Instance
   - Choose **Ubuntu Server 22.04 LTS**
   - Instance type: **t2.medium** (minimum) or **t2.large** (recommended)
   - Storage: **20 GB** minimum

2. **Configure Security Group**:
   
   Add the following **Inbound Rules**:
   
   | Type | Protocol | Port Range | Source | Description |
   |------|----------|------------|--------|-------------|
   | SSH | TCP | 22 | Your IP | SSH access |
   | Custom TCP | TCP | 4000 | 0.0.0.0/0 | MCP Server (for ElevenLabs) |
   | Custom TCP | TCP | 3000 | 0.0.0.0/0 | Frontend (optional) |
   | HTTP | TCP | 80 | 0.0.0.0/0 | HTTP (optional) |
   | HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS (optional) |

3. **Download your SSH key pair** (`.pem` file) and save it securely.

---

### **Step 2: Connect to Your EC2 Instance**

```bash
# Make your key private
chmod 400 your-key.pem

# Connect via SSH
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Replace `YOUR_EC2_PUBLIC_IP` with your actual EC2 public IP address (found in AWS Console).

---

### **Step 3: Run the Automated Setup Script**

Once connected to your EC2 instance, run:

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/luciadeoliveira-orangeloops/ol-boston-workshop/main/setup-ec2.sh | bash
```

Or manually:

```bash
# Clone the repository
git clone https://github.com/luciadeoliveira-orangeloops/ol-boston-workshop.git
cd ol-boston-workshop

# Run the setup script
chmod +x setup-ec2.sh
./setup-ec2.sh
```

The script will:
- ✅ Update the system
- ✅ Install Docker and Docker Compose
- ✅ Install Git
- ✅ Clone the repository
- ✅ Create the `.env` file from `.env.production.example`

---

### **Step 4: Configure Environment Variables**

Edit the `.env` file with your production settings:

```bash
nano .env
```

**Important variables to change**:

```bash
# Change this to a strong password!
POSTGRES_PASSWORD=YourStrongPasswordHere123!

# Update the DATABASE_URL with your new password
DATABASE_URL=postgres://workshop:YourStrongPasswordHere123!@postgres:5432/store

# Optional: Add ElevenLabs configuration if using the frontend
NEXT_PUBLIC_ELEVENLABS_WIDGET_SRC=your_widget_src
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
```

Save and exit (Ctrl+X, then Y, then Enter).

---

### **Step 5: Start the Application**

```bash
# Start all services in production mode
docker compose -f docker-compose.prod.yml up -d --build
```

This will start:
- 🗄️ PostgreSQL database
- ⚙️ Backend API
- 🔌 MCP Server (exposed on port 4000)
- 🌐 Frontend (exposed on port 3000)

**Note:** Unlike the local setup, this does NOT include ngrok. Your MCP server is directly accessible via your EC2 public IP.

---

### **Step 6: Verify Deployment**

Check that all services are running:

```bash
docker compose -f docker-compose.prod.yml ps
```

Test the MCP server:

```bash
# From your local machine or the EC2 instance
curl http://YOUR_EC2_PUBLIC_IP:4000/health
```

You should see: `{"status":"ok","service":"mcp"}`

---

### **Step 7: Configure ElevenLabs Agent**

1. Go to [ElevenLabs Voice Agents](https://elevenlabs.io/voice-lab/agents)
2. Create or edit your agent
3. Add webhooks using your EC2 public URL:

| Tool Name | URL | Method |
|-----------|-----|--------|
| **get_categories** | `http://YOUR_EC2_IP:4000/categories` | GET |
| **get_attributes** | `http://YOUR_EC2_IP:4000/attributes` | GET |
| **catalog_product_search** | `http://YOUR_EC2_IP:4000/query-products` | GET |
| **inventory_stock_lookup** | `http://YOUR_EC2_IP:4000/query-stock` | GET |

Replace `YOUR_EC2_IP` with your actual EC2 public IP address.

---

## 📊 Monitoring and Maintenance

### **View Logs**

```bash
# View all logs
docker compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker compose -f docker-compose.prod.yml logs -f mcp
docker compose -f docker-compose.prod.yml logs -f backend
```

### **Restart Services**

```bash
# Restart all services
docker compose -f docker-compose.prod.yml restart

# Restart specific service
docker compose -f docker-compose.prod.yml restart mcp
```

### **Stop Services**

```bash
docker compose -f docker-compose.prod.yml down
```

### **Update Application**

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 🔒 Security Best Practices

1. **Change Default Passwords**: Update `POSTGRES_PASSWORD` in `.env`
2. **Use HTTPS**: Consider setting up an SSL certificate with Let's Encrypt
3. **Restrict Security Group**: Limit port 4000 to ElevenLabs IP ranges if possible
4. **Regular Updates**: Keep your EC2 instance and Docker images updated
5. **Backup Database**: Set up regular PostgreSQL backups

---

## 🌐 Optional: Set Up a Domain Name

Instead of using the IP address, you can:

1. Register a domain (e.g., via Route 53, GoDaddy, etc.)
2. Create an A record pointing to your EC2 public IP
3. Use that domain in your ElevenLabs webhooks
4. (Optional) Set up HTTPS with Let's Encrypt/Certbot

Example:
```
https://yourapi.yourdomain.com/categories
```

---

## 🔧 Troubleshooting

### **Port 4000 Not Accessible**

- Check EC2 Security Group inbound rules
- Verify the service is running: `docker compose -f docker-compose.prod.yml ps`
- Check logs: `docker compose -f docker-compose.prod.yml logs mcp`

### **Database Connection Issues**

- Verify `DATABASE_URL` in `.env` matches your `POSTGRES_PASSWORD`
- Check PostgreSQL logs: `docker compose -f docker-compose.prod.yml logs postgres`

### **Out of Memory**

- Upgrade to a larger EC2 instance type (t2.large or better)
- Add swap space to your EC2 instance

---

## 💰 Cost Estimation

Approximate AWS costs (us-east-1 region):

| Resource | Type | Monthly Cost |
|----------|------|--------------|
| EC2 Instance | t2.medium | ~$33 |
| EBS Storage | 20 GB | ~$2 |
| Data Transfer | First 100 GB free | Variable |
| **Total** | | **~$35/month** |

**Note:** Actual costs may vary based on usage and region.

---

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker compose -f docker-compose.prod.yml logs -f`
2. Review the [main README](../README.md) for general setup information
3. Contact the workshop support team

---

Made with 🧡 by OrangeLoops R&D Studio
