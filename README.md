# 🚀 OpenMusic API - Quick Start Guide

Proyek ini terdiri dari **2 service terpisah** yang berkomunikasi via RabbitMQ:

## 📁 **Struktur Proyek**

```
openmusic_api/
├── 📡 openmusic-api/      # REST API Server (Producer)
├── 📧 export-service/     # Background Export Service (Consumer)
├── start-all.ps1          # Windows startup script
└── start-all.sh           # Linux/Mac startup script
```

## ⚡ **Quick Setup & Run**

### **🔧 Prerequisites**

- Node.js (v16+)
- PostgreSQL
- Redis Server
- RabbitMQ Server

### **🚀 Installation**

```bash
# Install API Server dependencies
cd openmusic-api
npm install

# Install Export Service dependencies
cd ../export-service
npm install
```

### **⚙️ Configuration**

```bash
# Setup API Server environment
cd openmusic-api
cp .env.example .env
# Edit .env with your database/Redis/RabbitMQ settings

# Setup Export Service environment
cd ../export-service
cp .env.example .env
# Edit .env with your database/SMTP/RabbitMQ settings
```

### **🗄️ Database Setup**

```bash
cd openmusic-api
npm run migrate:up
npm run setup:sample  # Optional: Load sample data
```

## ▶️ **Running Services**

### **Option 1: Automatic (Recommended for Windows)**

```powershell
# From root folder
.\start-all.ps1
```

### **Option 2: Manual (2 Terminals)**

**Terminal 1 - API Server:**

```bash
cd openmusic-api
npm run dev
```

**Terminal 2 - Export Service:**

```bash
cd export-service
npm run dev
```

### **Option 3: Production Mode**

```bash
# Terminal 1
cd openmusic-api && npm start

# Terminal 2
cd export-service && npm start
```

## 🎯 **Service URLs**

- **🌐 API Server:** http://localhost:5000
- **📧 Export Service:** Background service (no HTTP interface)
- **🐰 RabbitMQ Management:** http://localhost:15672 (guest/guest)
- **📊 Redis:** localhost:6379

## ✅ **Testing**

```bash
# Test API Server
curl http://localhost:5000/albums

# Test Export Service (requires authenticated user)
# Use Postman collection in openmusic-api/postman/
```

## 📚 **Documentation**

- **API Server:** [`openmusic-api/README.md`](openmusic-api/README.md)
- **Export Service:** [`export-service/README.md`](export-service/README.md)
- **Project Structure:** [`docs/PROJECT_STRUCTURE_GUIDE.md`](docs/PROJECT_STRUCTURE_GUIDE.md)
- **Environment Setup:** [`docs/ENVIRONMENT_SETUP_GUIDE.md`](docs/ENVIRONMENT_SETUP_GUIDE.md)

## 🛠 **Development Commands**

```bash
# API Server
cd openmusic-api
npm run dev          # Development mode
npm run lint         # Code linting
npm run migrate:up   # Database migration

# Export Service
cd export-service
npm run dev          # Development mode
npm run test         # Test connection
```

## 🔄 **Architecture Flow**

```
📱 Client → 📡 API Server → 🐰 RabbitMQ → 📧 Export Service → 📬 Email
                    ↓
                💾 Database
                    ↓
                ⚡ Redis Cache
```

## 📞 **Support**

Jika ada masalah, lihat dokumentasi lengkap di masing-masing service atau check:

- Database connection
- RabbitMQ server status
- Redis server status
- Environment variables
