# 📧 OpenMusic Export Service

**Consumer microservice** untuk menghandle export playlist dan mengirim email notification sebagai bagian dari arsitektur microservices OpenMusic API v3.

## 🎯 **Fungsi Service**

- 🎧 Mendengarkan message dari RabbitMQ queue `export:playlist`
- 📊 Mengekspor data playlist dari shared database
- 📧 Mengirim email dengan attachment file JSON playlist
- 🔄 Background processing untuk performance optimization
- ⚡ Async processing tanpa memblok API server

## 🏗️ **Arsitektur**

```
[API Server] → [RabbitMQ] → [Export Service] → [Email]
                   ↓               ↓              ↓
              Message Queue  Process Export   SMTP Server
                   ↓               ↓
               Queue Store    Shared Database
```

**Service Independence:**

- Deploy terpisah dari API server
- Scale independently sesuai load
- Technology stack focused untuk background processing
- Fault isolation dari main API

## 🚀 **Setup dan Installation**

### **Prerequisites**

- Node.js (v16 atau lebih baru)
- PostgreSQL Database (shared dengan API server)
- RabbitMQ Server (message broker)
- SMTP Email Configuration

### **Installation**

```bash
# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### **Environment Configuration**

Edit file `.env` dengan konfigurasi yang sesuai:

```env
# Database Configuration (Same as API Server)
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=openmusic_api
PGHOST=localhost
PGPORT=5432

# RabbitMQ Configuration (Same as API Server)
RABBITMQ_SERVER=amqp://localhost

# Email Configuration (Export Service Specific)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

**📧 Gmail Setup Tips:**

1. Enable 2-Factor Authentication
2. Generate App Password untuk SMTP_PASSWORD
3. Use App Password instead of regular password

### **Running Service**

```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

**Expected Console Output:**

```
🚀 Starting OpenMusic Export Service...
✅ Connected to RabbitMQ
⏳ Waiting for export requests...
```

## 📋 **Message Processing**

### **Input Message Format**

Service mendengarkan message dengan format JSON:

```json
{
  "playlistId": "playlist-Mk8AnmCp210PwT6B",
  "targetEmail": "user@example.com"
}
```

### **Output JSON Export Format**

Email attachment berupa JSON dengan struktur:

```json
{
  "playlist": {
    "id": "playlist-Mk8AnmCp210PwT6B",
    "name": "My Favorite Coldplay Songs",
    "songs": [
      {
        "id": "song-Qbax5Oy7L8WKf74l",
        "title": "Life in Technicolor",
        "performer": "Coldplay"
      },
      {
        "id": "song-RBNXOOWEg2Qbz5Ep",
        "title": "Viva la Vida",
        "performer": "Coldplay"
      }
    ]
  }
}
```

## 🔄 **Processing Flow**

1. **Consume Message** - Terima message dari RabbitMQ queue
2. **Validate Data** - Parse dan validasi message content
3. **Query Database** - Ambil data playlist dan songs
4. **Generate Export** - Format data ke JSON structure
5. **Send Email** - Kirim email dengan JSON attachment
6. **Acknowledge** - Confirm message processing complete

**Error Handling:**

- Message parsing errors → Log error, acknowledge message
- Database errors → Retry with exponential backoff
- Email sending errors → Retry with different strategy
- All errors logged for monitoring

## 🛠 **Service Dependencies**

| Package      | Version | Fungsi                                    |
| ------------ | ------- | ----------------------------------------- |
| `amqplib`    | ^0.10.4 | RabbitMQ client untuk message consumption |
| `nodemailer` | ^6.10.1 | Email service untuk SMTP                  |
| `pg`         | ^8.16.0 | PostgreSQL client untuk database access   |
| `dotenv`     | ^16.5.0 | Environment configuration                 |

**Dev Dependencies:**

- `eslint` - Code quality
- `nodemon` - Development auto-reload

## 📁 **Service Structure**

```
export-service/
├── 📄 package.json              # Service dependencies (4 packages)
├── 📄 README.md                 # Service documentation
├── 📄 .env.example             # Environment template
├── 📄 .gitignore               # Git ignore patterns
│
└── 📁 src/                      # Source code
    ├── 📄 index.js              # Main consumer application
    ├── 📁 services/             # Business logic
    │   ├── 📄 MailSender.js     # Email service implementation
    │   └── 📄 PlaylistsService.js # Database service untuk export
    └── 📁 utils/                # Utilities
        └── 📄 database.js       # Database connection
```

### **File Descriptions**

- **`index.js`** - Main application, RabbitMQ consumer setup
- **`MailSender.js`** - Email composition dan SMTP handling
- **`PlaylistsService.js`** - Database operations untuk export data
- **`database.js`** - PostgreSQL connection configuration

## 🧪 **Testing Export Service**

### **Manual Testing**

1. **Start service** - `npm run dev`
2. **Send export request** - Via API server atau manual message
3. **Check logs** - Service should show processing
4. **Verify email** - Check target email for attachment

### **Queue Testing**

```bash
# Check queue status
rabbitmqctl list_queues name messages

# Monitor queue in real-time
rabbitmqctl list_queues name messages consumers
```

### **Service Health Check**

```bash
# Test database connection
npm run test:connection

# Check service dependencies
curl http://localhost:15672  # RabbitMQ Management UI
```

## 🚨 **Troubleshooting**

### **Common Issues**

| Issue                          | Solution                          |
| ------------------------------ | --------------------------------- |
| **RabbitMQ Connection Failed** | Check rabbitmq-server running     |
| **Database Connection Error**  | Verify PostgreSQL & credentials   |
| **Email Not Sent**             | Check SMTP credentials & settings |
| **Queue Not Processing**       | Restart service, check RabbitMQ   |

### **Debug Commands**

```bash
# Check RabbitMQ status
rabbitmqctl status

# List active queues
rabbitmqctl list_queues

# Check service logs
npm run dev  # Watch for error messages

# Test email configuration
node -e "console.log(process.env.SMTP_USER)"
```

## 📊 **Monitoring**

### **Production Monitoring**

- **Queue Length** - Monitor pending messages
- **Processing Time** - Track export completion time
- **Error Rate** - Monitor failed exports
- **Email Delivery** - Track successful sends

### **Logging**

Service menggunakan structured logging:

```
🚀 Starting OpenMusic Export Service...
✅ Connected to RabbitMQ
⏳ Waiting for export requests...
📥 Processing export request for playlist playlist-123
✅ Export playlist playlist-123 sent to user@example.com
❌ Export failed: [Error details]
```

## 🔧 **Deployment**

### **Production Deployment**

```bash
# Install production dependencies only
npm ci --production

# Start with PM2 (recommended)
pm2 start npm --name "export-service" -- start

# Or direct start
npm start
```

### **Environment Variables Production**

```env
NODE_ENV=production
PGUSER=prod_user
PGPASSWORD=secure_password
PGDATABASE=openmusic_prod
RABBITMQ_SERVER=amqp://prod-rabbitmq-server
SMTP_HOST=smtp.mailgun.org
```

### **Scaling**

```bash
# Multiple instances untuk load balancing
pm2 start npm --name "export-service-1" -- start
pm2 start npm --name "export-service-2" -- start
pm2 start npm --name "export-service-3" -- start
```

## 🔄 **Integration dengan API Server**

### **API Server Integration**

Export service terintegrasi dengan API server melalui:

1. **Shared Database** - Same PostgreSQL database
2. **Message Queue** - RabbitMQ untuk async communication
3. **Environment Sync** - Consistent configuration

### **API Endpoint Integration**

```javascript
// API Server sends export request
POST /export/playlists/{id}
{
  "targetEmail": "user@example.com"
}

// Response (immediate)
{
  "status": "success",
  "message": "Permintaan Anda sedang kami proses"
}

// Background processing oleh Export Service
// Email delivered with playlist JSON
```

---

**📧 Export Service** - _Microservice untuk background email processing dengan arsitektur yang scalable dan fault-tolerant_

> **💡 Tip:** Service ini dirancang untuk berjalan independent dari API server, memungkinkan scaling dan deployment terpisah sesuai kebutuhan load processing.
