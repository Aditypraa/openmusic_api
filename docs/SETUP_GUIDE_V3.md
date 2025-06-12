# OpenMusic API v3 - Complete Setup Guide

## 📖 Studi Kasus

Semenjak dirilisnya OpenMusic versi 2, pengguna semakin membludak dan server sering mengalami down karena beban database yang tinggi. Tim TSC memutuskan untuk mengembangkan OpenMusic v3 dengan fitur:

1. **Server-side caching** menggunakan Redis
2. **Export playlist** via email menggunakan RabbitMQ
3. **Upload cover album** dengan storage flexible
4. **Album likes system** untuk interaksi pengguna

## 🎯 Kriteria yang Harus Dipenuhi

OpenMusic API v3 harus memenuhi **5 kriteria utama**:

### ✅ Kriteria 1: Ekspor Lagu Pada Playlist

- Endpoint: `POST /export/playlists/{playlistId}`
- Menggunakan RabbitMQ sebagai message broker
- Hanya pemilik playlist yang boleh mengekspor
- Program consumer terpisah untuk memproses export
- Hasil dikirim via email dalam format JSON

### ✅ Kriteria 2: Mengunggah Sampul Album

- Endpoint: `POST /albums/{id}/covers`
- Support MIME types images dengan max 512KB
- Flexible storage: File System lokal atau S3 Bucket
- URL cover dapat diakses dan ditampilkan di GET album

### ✅ Kriteria 3: Menyukai Album

- Endpoint: `POST/DELETE /albums/{id}/likes` (Auth required)
- Endpoint: `GET /albums/{id}/likes` (Public)
- Pengguna hanya bisa like album yang sama 1 kali
- Sistem authentication untuk mencegah spam

### ✅ Kriteria 4: Server-Side Cache

- Cache pada `GET /albums/{id}/likes` selama 30 menit
- Custom header `X-Data-Source: "cache"` untuk response dari cache
- Cache dihapus saat ada perubahan likes
- Menggunakan Redis sebagai memory caching engine

### ✅ Kriteria 5: Pertahankan Fitur v2 dan v1

- Semua fitur V1 (Albums, Songs) tetap berfungsi
- Semua fitur V2 (Auth, Playlists, Collaborations) tetap berfungsi
- Foreign key relationships terjaga
- Data validation dan error handling tetap robust

## 🛠 Prerequisites Setup

OpenMusic API v3 memerlukan beberapa services tambahan untuk berfungsi optimal:

### 🔴 Redis Setup (Required untuk Caching)

Redis diperlukan untuk server-side caching pada endpoint likes album.

#### Windows

```bash
# Option 1: Download Redis untuk Windows
https://github.com/microsoftarchive/redis/releases

# Option 2: Gunakan Docker (Recommended)
docker run -d --name redis -p 6379:6379 redis:latest

# Option 3: Memurai (Redis-compatible untuk Windows)
https://www.memurai.com/
```

#### Linux/Mac

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis

# macOS
brew install redis
brew services start redis

# Verify Redis installation
redis-cli ping
# Should return: PONG
```

### 🐰 RabbitMQ Setup (Required untuk Export)

RabbitMQ diperlukan sebagai message broker untuk fitur export playlist.

#### Windows

```bash
# Option 1: Download RabbitMQ dari official website
https://www.rabbitmq.com/download.html

# Option 2: Gunakan Docker (Recommended)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

# Option 3: Chocolatey
choco install rabbitmq
```

#### Linux/Mac

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install rabbitmq-server
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server

# macOS
brew install rabbitmq
brew services start rabbitmq

# Enable management plugin (optional)
sudo rabbitmq-plugins enable rabbitmq_management

# Verify RabbitMQ installation
rabbitmqctl status
# Should show running status

# Access management UI (optional)
# http://localhost:15672 (username: guest, password: guest)
```

### 📧 Email Setup (Required untuk Export)

1. **Gmail Setup:**

   - Enable 2-factor authentication
   - Generate App Password
   - Use App Password sebagai SMTP_PASSWORD

2. **Environment Variables:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

### ☁️ AWS S3 Setup (Optional untuk File Storage)

1. **Create S3 Bucket:**

   - Login ke AWS Console
   - Create new S3 bucket
   - Set public read access untuk uploaded files

2. **Create IAM User:**

   - Create IAM user with S3 access
   - Generate Access Key ID dan Secret Access Key

3. **Environment Variables:**
   ```env
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   AWS_BUCKET_NAME=your_bucket_name
   ```

## 📋 Complete Environment Setup

### 1. **Install Dependencies**

```powershell
# Clone atau download project
cd "c:\Users\adity\My Drive (aditypraa@gmail.com)\My Computer\Project Website\Personal Project\Intensive Learning alur belajar React\openmusic_api"

# Install npm dependencies
npm install

# Install AWS SDK v3 for S3 (jika belum ada)
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 2. **Environment Configuration**

```powershell
# Copy environment template
cp .env.example .env

# Edit .env file with your actual values
```

**Complete .env Configuration:**

```env
# Server Configuration
HOST=localhost
PORT=5000

# Database Configuration
PGUSER=postgres
PGPASSWORD=your_database_password
PGDATABASE=openmusic_api
PGHOST=localhost
PGPORT=5432

# JWT Secrets (Generate secure keys)
ACCESS_TOKEN_KEY=your_super_secret_access_key_minimum_32_chars
REFRESH_TOKEN_KEY=your_super_secret_refresh_key_minimum_32_chars
ACCESS_TOKEN_AGE=3600
REFRESH_TOKEN_AGE=86400

# Redis Configuration (Required)
REDIS_SERVER=127.0.0.1

# RabbitMQ Configuration (Required)
RABBITMQ_SERVER=amqp://localhost

# SMTP Configuration (Required untuk export)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_16_char_app_password

# Storage Configuration
STORAGE_TYPE=local

# AWS S3 Configuration (Optional)
AWS_BUCKET_NAME=openmusic-covers
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

### 3. **Database Setup**

```powershell
# Test database connection
npm run test:db

# Run database migrations
npm run migrate:up

# Setup sample data (optional)
npm run setup:sample
```

### 4. **Services Verification**

```powershell
# Verify Redis
redis-cli ping
# Expected: PONG

# Verify RabbitMQ
rabbitmqctl status
# Expected: Status of node ...

# Test storage configuration
node test-storage.js
# Expected: ✅ Storage service created successfully!
```

### 5. **Start Development**

```powershell
# Terminal 1: Start API Server (from openmusic-api directory)
cd openmusic-api
npm run dev

# Terminal 2: Start Export Service (from export-service directory)
cd export-service
npm run dev
```

**Expected Console Output:**

```
📁 Using Local Storage Service
✅ Redis connected successfully
✅ Database connected successfully
✅ RabbitMQ connected successfully
Server running on http://localhost:5000
Consumer ready to process export requests
```

## 🧪 Testing & Verification

### 1. **Quick API Test**

```powershell
# Test basic endpoints
curl http://localhost:5000/albums
curl http://localhost:5000/songs

# Test health check
curl http://localhost:5000/health
```

### 2. **V3 Features Testing**

#### A. **Upload Cover Test**

```powershell
# Test album cover upload
curl -X POST http://localhost:5000/albums/{album-id}/covers `
  -F "cover=@path/to/image.jpg" `
  -H "Content-Type: multipart/form-data"
```

#### B. **Caching Test**

```powershell
# Test caching behavior
curl -v http://localhost:5000/albums/{album-id}/likes
# Check for X-Data-Source header

# First request: X-Data-Source: database
# Second request: X-Data-Source: cache
```

#### C. **Export Test**

```powershell
# Login and get access token first
$token = "your_access_token"

# Export playlist
curl -X POST http://localhost:5000/export/playlists/{playlist-id} `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{"targetEmail": "test@example.com"}'

# Check email inbox for JSON attachment
```

### 3. **Production Readiness Check**

```powershell
# Environment check
node -e "console.log('✅ Node.js version:', process.version)"
redis-cli --version
rabbitmqctl version

# Dependencies check
npm audit
npm run lint
npm run prettier

# Performance check
npm run test:db
# Should connect < 1 second
```

## 🚨 Troubleshooting Guide

### Common Issues & Solutions

| Issue                          | Symptoms                          | Solution                                     |
| ------------------------------ | --------------------------------- | -------------------------------------------- |
| **Redis Connection Failed**    | `Error: Redis connection refused` | `redis-server` or check `REDIS_SERVER` env   |
| **RabbitMQ Connection Failed** | `Error: AMQP connection failed`   | Start RabbitMQ or check `RABBITMQ_SERVER`    |
| **Database Connection Failed** | `Error: connection refused`       | Check PostgreSQL service & credentials       |
| **SMTP Authentication Failed** | `Error: Invalid login`            | Use Gmail App Password, not regular password |
| **S3 Upload Failed**           | `Error: Access Denied`            | Check AWS credentials & bucket permissions   |
| **File Too Large**             | `413 Payload Too Large`           | Ensure file ≤ 512KB                          |
| **Cache Not Working**          | No `X-Data-Source` header         | Verify Redis connection & TTL settings       |
| **Export Not Sent**            | Email not received                | Check SMTP config & consumer running         |

### Service Status Commands

```powershell
# Check all services
Get-Service | Where-Object {$_.Name -like "*redis*"}     # Redis
Get-Service | Where-Object {$_.Name -like "*rabbit*"}   # RabbitMQ
Get-Service | Where-Object {$_.Name -like "*postgres*"} # PostgreSQL

# Test connections
redis-cli ping                    # Should return PONG
rabbitmqctl status               # Should show running
npm run test:db                  # Should connect successfully
node test-storage.js             # Should show storage type
```

### Performance Optimization

```powershell
# Monitor Redis cache hit rate
redis-cli info stats | findstr "keyspace"

# Monitor RabbitMQ queue length
rabbitmqctl list_queues

# Monitor database connections
npm run test:db
```

## 🚀 Production Deployment

### Environment Variables Checklist

- [ ] **Database**: All PGUSER, PGPASSWORD, PGDATABASE configured
- [ ] **JWT**: Strong ACCESS_TOKEN_KEY & REFRESH_TOKEN_KEY (≥32 chars)
- [ ] **Redis**: REDIS_SERVER pointing to production Redis
- [ ] **RabbitMQ**: RABBITMQ_SERVER pointing to production instance
- [ ] **SMTP**: Valid email credentials for production
- [ ] **Storage**: STORAGE_TYPE and AWS credentials (if using S3)
- [ ] **Security**: No default passwords or keys in production

### Services Management (Production)

```powershell
# Using PM2 for production
npm install -g pm2

# Start API Server (from openmusic-api directory)
cd openmusic-api
pm2 start src/server.js --name "openmusic-api"

# Start Export Service (from export-service directory)
cd ../export-service
pm2 start src/index.js --name "openmusic-export-service"

# Monitor services
pm2 status
pm2 logs openmusic-api
pm2 logs openmusic-export-service

# Auto-restart on system reboot
pm2 startup
pm2 save
```

### Docker Deployment (Alternative)

```powershell
# Using Docker Compose
docker-compose up -d

# Check services
docker-compose ps
docker-compose logs api
docker-compose logs consumer
```

## 📊 Monitoring & Maintenance

### Health Checks

```powershell
# API Health
curl http://localhost:5000/albums

# Cache Health
redis-cli info memory

# Queue Health
rabbitmqctl list_queues

# Database Health
npm run test:db
```

### Log Monitoring

```powershell
# Application logs
pm2 logs openmusic-api --lines 100

# System logs
Get-EventLog -LogName Application -Source "OpenMusic*" -Newest 50
```

---

## 🎉 Final Summary

**🎯 OpenMusic API v3 Setup Complete!**

### ✅ **Services Configured:**

- **PostgreSQL** - Database dengan migrations
- **Redis** - Server-side caching
- **RabbitMQ** - Message broker untuk export
- **SMTP Email** - Notifications dan export delivery
- **AWS S3** - Cloud storage (optional)

### ✅ **Features Ready:**

- **Albums & Songs** - CRUD operations
- **Authentication** - JWT-based security
- **Playlists** - Management & collaboration
- **Album Likes** - With caching system
- **Cover Upload** - File handling & storage
- **Playlist Export** - Async processing via email

### ✅ **Production Ready:**

- Environment configuration complete
- All services verified and running
- Error handling and validation implemented
- Documentation and testing guides available

### 🚀 **Next Steps:**

1. **Test API endpoints** menggunakan Postman collection
2. **Verify all V3 features** (upload, likes, export, caching)
3. **Monitor performance** dan optimize jika diperlukan
4. **Deploy to production** dengan confidence!

---

**Happy Coding! 🎵**

OpenMusic API v3 siap melayani jutaan pengguna dengan performa optimal dan fitur lengkap!
