# 🔧 Environment Setup Guide - OpenMusic API v3 Microservices

Panduan lengkap setup environment untuk OpenMusic API v3 dengan arsitektur microservices.

## 📋 Overview

OpenMusic API v3 menggunakan arsitektur microservices dengan 2 service independen:

- **API Server** (Producer) - REST API endpoints
- **Export Service** (Consumer) - Background email processing

## 🏗️ Architecture Overview

```
┌─────────────────┐    RabbitMQ    ┌─────────────────┐
│   API Server    │────────────────▶│ Export Service  │
│  (Port: 5000)   │                │                 │
│                 │                │                 │
│ • REST API      │                │ • Email Export  │
│ • Authentication│                │ • Queue Process │
│ • File Upload   │                │ • Background    │
│ • Redis Cache   │                │   Processing    │
└─────────────────┘                └─────────────────┘
         │                                    │
         └────── Shared PostgreSQL DB ───────┘
```

## 🔧 Service Dependencies

### **API Server Dependencies**

- PostgreSQL (database)
- Redis (caching)
- RabbitMQ (message publishing)
- AWS S3 (optional - file storage)

### **Export Service Dependencies**

- PostgreSQL (database - same as API Server)
- RabbitMQ (message consumption)
- SMTP Server (email sending)

## 📁 Environment Files Structure

```
openmusic_api/
├── openmusic-api/
│   ├── .env                    # API Server environment
│   └── .env.example           # API Server template
└── export-service/
    ├── .env                   # Export Service environment
    └── .env.example          # Export Service template
```

## ⚙️ API Server Environment (.env)

**Path:** `openmusic-api/.env`

```env
# Server Configuration
HOST=localhost
PORT=5000

# Database Configuration (Shared)
PGUSER=postgres
PGPASSWORD=admin
PGDATABASE=openmusic_api
PGHOST=localhost
PGPORT=5432

# JWT Secrets (Secure these in production)
ACCESS_TOKEN_KEY=your_super_secret_access_key_here_min_32_chars
REFRESH_TOKEN_KEY=your_super_secret_refresh_key_here_min_32_chars
ACCESS_TOKEN_AGE=3600
REFRESH_TOKEN_AGE=86400

# Redis Configuration (Required for caching)
REDIS_SERVER=localhost

# RabbitMQ Configuration (Required for export)
RABBITMQ_SERVER=amqp://localhost

# Storage Configuration
STORAGE_TYPE=local  # 'local' atau 's3'

# AWS S3 Configuration (Optional - only if STORAGE_TYPE=s3)
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=ap-southeast-1
AWS_BUCKET_NAME=openmusic-covers
```

### **API Server Environment Variables Explained**

| Variable                | Required    | Description                    | Example            |
| ----------------------- | ----------- | ------------------------------ | ------------------ |
| `HOST`                  | Yes         | Server host                    | `localhost`        |
| `PORT`                  | Yes         | Server port                    | `5000`             |
| `PGUSER`                | Yes         | Database username              | `postgres`         |
| `PGPASSWORD`            | Yes         | Database password              | `admin`            |
| `PGDATABASE`            | Yes         | Database name                  | `openmusic_api`    |
| `PGHOST`                | Yes         | Database host                  | `localhost`        |
| `PGPORT`                | Yes         | Database port                  | `5432`             |
| `ACCESS_TOKEN_KEY`      | Yes         | JWT access token secret        | Min 32 characters  |
| `REFRESH_TOKEN_KEY`     | Yes         | JWT refresh token secret       | Min 32 characters  |
| `ACCESS_TOKEN_AGE`      | Yes         | Access token expiry (seconds)  | `3600` (1 hour)    |
| `REFRESH_TOKEN_AGE`     | Yes         | Refresh token expiry (seconds) | `86400` (24 hours) |
| `REDIS_SERVER`          | Yes         | Redis server host              | `localhost`        |
| `RABBITMQ_SERVER`       | Yes         | RabbitMQ connection string     | `amqp://localhost` |
| `STORAGE_TYPE`          | No          | Storage type                   | `local` or `s3`    |
| `AWS_ACCESS_KEY_ID`     | Conditional | AWS access key (if S3)         | AWS credential     |
| `AWS_SECRET_ACCESS_KEY` | Conditional | AWS secret key (if S3)         | AWS credential     |
| `AWS_REGION`            | Conditional | AWS region (if S3)             | `ap-southeast-1`   |
| `AWS_BUCKET_NAME`       | Conditional | S3 bucket name (if S3)         | `openmusic-covers` |

## 📧 Export Service Environment (.env)

**Path:** `export-service/.env`

```env
# Database Configuration (Same as API Server)
PGUSER=postgres
PGPASSWORD=admin
PGDATABASE=openmusic_api
PGHOST=localhost
PGPORT=5432

# RabbitMQ Configuration (Same as API Server)
RABBITMQ_SERVER=amqp://localhost

# Email Configuration (Export Service Specific)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password_or_token
```

### **Export Service Environment Variables Explained**

| Variable          | Required | Description                              | Example                |
| ----------------- | -------- | ---------------------------------------- | ---------------------- |
| `PGUSER`          | Yes      | Database username (same as API Server)   | `postgres`             |
| `PGPASSWORD`      | Yes      | Database password (same as API Server)   | `admin`                |
| `PGDATABASE`      | Yes      | Database name (same as API Server)       | `openmusic_api`        |
| `PGHOST`          | Yes      | Database host (same as API Server)       | `localhost`            |
| `PGPORT`          | Yes      | Database port (same as API Server)       | `5432`                 |
| `RABBITMQ_SERVER` | Yes      | RabbitMQ connection (same as API Server) | `amqp://localhost`     |
| `SMTP_HOST`       | Yes      | SMTP server host                         | `smtp.gmail.com`       |
| `SMTP_PORT`       | Yes      | SMTP server port                         | `587`                  |
| `SMTP_USER`       | Yes      | Email username                           | `your_email@gmail.com` |
| `SMTP_PASSWORD`   | Yes      | Email password or app token              | Gmail app password     |

## 🔐 Security Best Practices

### **JWT Secrets**

```bash
# Generate secure random strings (minimum 32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Gmail App Password Setup**

1. Enable 2-Factor Authentication in Gmail
2. Go to Google Account → Security → App passwords
3. Generate app password for "Mail"
4. Use app password as `SMTP_PASSWORD`

### **Database Security**

- Use strong passwords for database users
- Create separate database user for the application
- Grant only necessary permissions

## 🚀 Environment Setup Steps

### **1. Clone Repository**

```bash
git clone <repository-url>
cd openmusic_api
```

### **2. Setup API Server Environment**

```bash
cd openmusic-api
cp .env.example .env
# Edit .env file with your configuration
```

### **3. Setup Export Service Environment**

```bash
cd ../export-service
cp .env.example .env
# Edit .env file with your configuration
```

### **4. Install Dependencies**

```bash
# API Server
cd openmusic-api
npm install

# Export Service
cd ../export-service
npm install
```

### **5. Setup External Services**

**PostgreSQL:**

```bash
# Create database
createdb openmusic_api

# Run migrations (from API Server directory)
cd openmusic-api
npm run migrate:up
```

**Redis:**

```bash
# Start Redis server
redis-server

# Verify connection
redis-cli ping  # Should return PONG
```

**RabbitMQ:**

```bash
# Start RabbitMQ server
rabbitmq-server

# Verify status
rabbitmqctl status

# Access management UI (optional)
# http://localhost:15672 (guest/guest)
```

### **6. Verify Environment**

```bash
# Test API Server dependencies
cd openmusic-api
npm run test:db

# Test Export Service dependencies
cd ../export-service
npm run test:connection
```

## 🔄 Environment Sync

### **Shared Configurations**

These must be **identical** across both services:

```env
# Database (MUST be same)
PGUSER=postgres
PGPASSWORD=admin
PGDATABASE=openmusic_api
PGHOST=localhost
PGPORT=5432

# RabbitMQ (MUST be same)
RABBITMQ_SERVER=amqp://localhost
```

### **Service-Specific Configurations**

**API Server Only:**

- JWT secrets
- Redis configuration
- Storage configuration (S3/Local)
- Server host/port

**Export Service Only:**

- SMTP configuration
- Email credentials

## 🧪 Environment Testing

### **API Server Environment Test**

```bash
cd openmusic-api

# Test database connection
npm run test:db

# Test Redis connection
redis-cli ping

# Test RabbitMQ connection
rabbitmqctl status

# Start development server
npm run dev
```

**Expected Output:**

```
📁 Using Local Storage Service
✅ Redis connected successfully
✅ Database connected successfully
Server running on http://localhost:5000
```

### **Export Service Environment Test**

```bash
cd export-service

# Test service dependencies
npm run test:connection

# Start development service
npm run dev
```

**Expected Output:**

```
🚀 Starting OpenMusic Export Service...
✅ Connected to RabbitMQ
⏳ Waiting for export requests...
```

## 🚨 Common Environment Issues

### **Database Connection Issues**

```bash
# Check PostgreSQL status
systemctl status postgresql
# or
brew services list | grep postgresql

# Check database exists
psql -U postgres -l | grep openmusic
```

### **Redis Connection Issues**

```bash
# Check Redis status
redis-cli ping

# Start Redis if not running
redis-server
# or
brew services start redis
```

### **RabbitMQ Connection Issues**

```bash
# Check RabbitMQ status
rabbitmqctl status

# Start RabbitMQ if not running
rabbitmq-server
# or
brew services start rabbitmq
```

### **SMTP Configuration Issues**

- Verify Gmail app password is correct
- Check Gmail 2FA is enabled
- Test SMTP connection manually

## 🌍 Production Environment

### **Production API Server (.env)**

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=5000

# Use secure database credentials
PGUSER=openmusic_user
PGPASSWORD=secure_production_password
PGDATABASE=openmusic_prod
PGHOST=prod-db-server
PGPORT=5432

# Use strong JWT secrets
ACCESS_TOKEN_KEY=very_long_secure_random_string_32_chars_min
REFRESH_TOKEN_KEY=another_very_long_secure_random_string_32_chars

# Production Redis
REDIS_SERVER=prod-redis-server

# Production RabbitMQ
RABBITMQ_SERVER=amqp://user:pass@prod-rabbitmq-server

# Production S3
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=prod_access_key
AWS_SECRET_ACCESS_KEY=prod_secret_key
AWS_REGION=ap-southeast-1
AWS_BUCKET_NAME=openmusic-prod-covers
```

### **Production Export Service (.env)**

```env
NODE_ENV=production

# Production database (same as API Server)
PGUSER=openmusic_user
PGPASSWORD=secure_production_password
PGDATABASE=openmusic_prod
PGHOST=prod-db-server
PGPORT=5432

# Production RabbitMQ (same as API Server)
RABBITMQ_SERVER=amqp://user:pass@prod-rabbitmq-server

# Production SMTP
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=openmusic@yourdomain.com
SMTP_PASSWORD=secure_smtp_password
```

---

**🔧 Environment Setup Guide** - _Comprehensive configuration guide untuk production-ready microservices deployment_
