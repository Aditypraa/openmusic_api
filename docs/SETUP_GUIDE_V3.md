# OpenMusic API v3 - Setup Guide

## Prerequisites Setup

OpenMusic API v3 memerlukan beberapa services tambahan untuk berfungsi optimal.

### 🔴 Redis Setup (Required untuk Caching)

#### Windows

```bash
# Download Redis untuk Windows
https://github.com/microsoftarchive/redis/releases

# Atau gunakan Docker
docker run -d --name redis -p 6379:6379 redis:latest
```

#### Linux/Mac

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install redis-server

# macOS
brew install redis
```

### 🐰 RabbitMQ Setup (Required untuk Export)

#### Windows

```bash
# Download RabbitMQ dari official website
https://www.rabbitmq.com/download.html

# Atau gunakan Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

#### Linux/Mac

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install rabbitmq-server

# macOS
brew install rabbitmq
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

## Development Flow

### 1. Start Services

```bash
# Start Redis
redis-server

# Start RabbitMQ
rabbitmq-server

# Check RabbitMQ Management UI
# http://localhost:15672 (guest/guest)
```

### 2. Start Application

```bash
# Terminal 1: Start API Server
npm run dev

# Terminal 2: Start Consumer
npm run dev:consumer
```

### 3. Test Flow

1. Register user → Login → Get token
2. Create album → Upload cover
3. Like/unlike album (test caching)
4. Create playlist → Export playlist → Check email

## Troubleshooting

### Redis Connection Issues

```bash
# Check if Redis is running
redis-cli ping

# Should return PONG
```

### RabbitMQ Connection Issues

```bash
# Check RabbitMQ status
rabbitmqctl status

# Check management UI
http://localhost:15672
```

### Email Issues

- Verify Gmail App Password
- Check firewall/antivirus blocking SMTP
- Test with different email provider

### S3 Issues

- Verify AWS credentials
- Check bucket permissions
- Test bucket access in AWS Console

## Production Deployment

### Environment Variables

Pastikan semua environment variables sudah diset:

- Database connection
- Redis server
- RabbitMQ server
- SMTP credentials
- AWS credentials (jika menggunakan S3)

### Services Management

```bash
# Start all services with PM2
pm2 start src/server.js --name openmusic-api
pm2 start src/consumer/index.js --name openmusic-consumer

# Or use Docker Compose
docker-compose up -d
```

Happy coding! 🎵
