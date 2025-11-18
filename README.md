# 🗣️ Voice AI Workshop – ElevenLabs + MCP + Docker

Welcome to the **Voice Agent Workshop**!  
In this session, you'll connect a **voice-powered AI agent** (built with ElevenLabs) to a **backend** deployed on AWS that provides product and stock data — all accessible via an AWS API Gateway endpoint.

---

## 🧰 Pre-Workshop Setup

Before the session, make sure you have the following installed and configured:

| Tool | Purpose | Notes |
|------|----------|-------|
| **Docker Desktop (Optional)** | Runs all workshop services (DB, backend, MCP) | [Download Docker Desktop](https://www.docker.com/products/docker-desktop/) - Must be running before starting |
| **Git** | To clone the project repository | [Download Git](https://git-scm.com/downloads) |
| **Visual Studio Code (Optional)** | Recommended IDE | [Download VS Code](https://code.visualstudio.com/) |
| **ElevenLabs Account** | To build and test your AI voice agent | [Sign up here](https://elevenlabs.io) |

---

## 🚀 Getting Started

### **1️⃣ Clone the repository**

```bash
git clone https://github.com/luciadeoliveira-orangeloops/ol-boston-workshop.git
cd ol-boston-workshop
```

---

### **2️⃣ Create your environment file**

Duplicate the example:

#### macOS/Linux:
```bash
cp .env.example .env
```

#### Windows:
```powershell
copy .env.example .env
```

Then open `.env` and configure the following variables:

```bash
# PostgreSQL Database
POSTGRES_USER=workshop
POSTGRES_PASSWORD=workshop
POSTGRES_DB=store
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Backend API
BACKEND_PORT=3001
DATABASE_URL=postgres://workshop:workshop@postgres:5432/store

# MCP Server
MCP_PORT=4000
BACKEND_URL=http://backend:3001
DOCS_PATH=/app/docs

# Frontend (retail-catalog) - Optional
NEXT_PUBLIC_API_BASE_URL=/api
NEXT_PUBLIC_ELEVENLABS_WIDGET_SRC=
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=
```

**Important:** 
- All configuration is centralized in the root `.env` file - no need to create separate `.env` files in subdirectories.

---

### **3️⃣ Verify your setup (optional but recommended)**

Before starting, you can run our verification script to check if all requirements are installed:

#### macOS/Linux:
```bash
./check-setup.sh
```

#### Windows (PowerShell):
```powershell
.\check-setup.ps1
```

The script will check:
- ✓ Docker Desktop installation and status
- ✓ Git installation
- ✓ VS Code installation (optional)
- ✓ `.env` file configuration

Fix any issues before proceeding to the next step.

---

### **4️⃣ Start all services with Docker**

```bash
docker compose up --build
```

This will automatically start:
- 🗄️ PostgreSQL (with demo data)
- ⚙️ Backend API (`/api/products`, `/api/stock`)
- 🔌 MCP Server (`/categories`, `/attributes`, `/query-products`, `/query-stock`)

Wait until you see:
```
✅ MCP listening on http://0.0.0.0:4000
```

---

### **5️⃣ Verify that everything is running**

Click the following URLs to verify your services are working:

**Backend API:**
- [Get all products](http://localhost:3001/api/products)
- [Get blue hoodies](http://localhost:3001/api/products?color=blue&category=hoodies)

**MCP Server:**
- [Get all categories](http://localhost:4000/categories)
- [Query products with filters](http://localhost:4000/query-products?color=blue&category=hoodies)

You should see JSON responses from all endpoints.

---

### **6️⃣ Create your ElevenLabs Agent**

1. Go to [ElevenLabs Voice Agents](https://elevenlabs.io)  
2. Click **“Create Agent”**

| Field | Value |
|--------|--------|
| **Name** | `Voice Workshop Agent` |
| **Description** | Voice AI that helps users find products and check stock |
| **Language** | English |
| **Voice** | Any |
| **Execution Mode** | Immediate |
| **Interruptions** | Disabled |

---

### **7️⃣ Connect the MCP Server**

1. In ElevenLabs, open your agent → **Integrations**
2. Click **"Add Integration"** → **"Custom MCP Server"**
3. Configure the MCP server:

| Field | Value |
|--------|--------|
| **Server URL** | `https://fsvdcoej2h.execute-api.us-east-1.amazonaws.com/dev/mcp` |
| **Name** | `Retail Catalog MCP` |
| **Description** | Connects to product catalog and inventory system |
| **Transport** | Streamable HTTP (not SSE) |

The MCP server will automatically expose all available tools (get_categories, get_attributes, catalog_product_search, inventory_stock_lookup) to your agent.

---

### **8️⃣ Upload Knowledge Documents (RAG)**

To give your agent company-specific context:

1. In ElevenLabs, open your agent → **Knowledge Base**
2. Upload documents like:
   - Return & exchange policies  
   - Delivery and warranty info  
   - FAQs  

ElevenLabs will automatically perform **Retrieval-Augmented Generation (RAG)** when answering related questions.

---

### **9️⃣ Test Your Agent**

Try these questions:
- "Do you have shirts for men?"
- "What Wildcraft backpacks do you have available?"
- "I'm looking for white Nike sports shoes"
- "Do you have Fossil watches?"
- "What brown wallets do you have for men?"
- "How long do I have to return a product?"

---

### **🔟 Run the Frontend**

This will open a simple store interface with:
- Product listings  
- Category filters  
- Embedded ElevenLabs voice widget  

---

## 🧠 By the End of This Workshop You’ll Have:

- A working **voice-enabled AI agent**  
- Connected **MCP tools** bridging ElevenLabs and your backend  
- Optional **RAG-powered knowledge base**  
- A ready-to-extend base for new integrations (WhatsApp, LangGraph, etc.)

---

### 🧩 Next Steps

- Integrate the same agent with **WhatsApp** via Twilio or Meta API  
- Use **LangGraph** for deeper reasoning and RAG orchestration  
- Expand the **Knowledge Base** with more company documents  

---

Made with 🧡 by OrangeLoops R&D Studio
