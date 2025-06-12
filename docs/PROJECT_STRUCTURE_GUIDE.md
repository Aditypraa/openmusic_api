# 🏗️ Project Structure Guide - OpenMusic API v3 Microservices

Panduan lengkap arsitektur dan struktur proyek OpenMusic API v3 menggunakan **Microservices Architecture** dengan Node.js dan Hapi.js framework, termasuk fitur v3 terbaru: export playlist, upload cover, album likes, dan caching.

## 📋 Daftar Isi

- [Arsitektur Microservices](#-arsitektur-microservices)
- [Struktur Folder](#-struktur-folder)
- [Service Architecture](#-service-architecture)
- [Communication Flow](#-communication-flow)
- [Design Patterns](#-design-patterns)
- [Best Practices](#-best-practices)

## 🎯 Arsitektur Microservices

OpenMusic API v3 mengimplementasikan **Microservices Architecture** dengan 2 service independen:

```
┌─────────────────────────────────────────┐
│           MICROSERVICES LAYER           │
│     (Independent Services)              │
├─────────────────────────────────────────┤
│          COMMUNICATION LAYER            │
│   (RabbitMQ Message Queue)              │
├─────────────────────────────────────────┤
│         SHARED DATA LAYER               │
│     (PostgreSQL Database)               │
├─────────────────────────────────────────┤
│        INFRASTRUCTURE LAYER             │
│  (Redis, AWS S3, SMTP)                  │
└─────────────────────────────────────────┘
```

### **Service Responsibilities:**

**🎵 Producer Service (API Server):**

- REST API endpoints
- User authentication & authorization
- File upload handling
- Redis caching
- RabbitMQ message publishing

**📧 Consumer Service (Export Service):**

- RabbitMQ message consumption
- Email processing & sending
- Background data export
- Queue monitoring

**Keuntungan Microservices Architecture:**

- 🔄 **Independent Deployment** - Services dapat di-deploy secara terpisah
- 📈 **Horizontal Scaling** - Scale services sesuai kebutuhan
- 🧪 **Technology Diversity** - Berbeda tech stack per service
- 🔒 **Fault Isolation** - Failure di satu service tidak affect yang lain
- 👥 **Team Independence** - Different teams dapat work on different services
- ⚡ **Performance Optimization** - Optimize per service requirements

---

## 📁 Struktur Folder Microservices

```
openmusic_api/                          # Root directory
├── 📄 FINAL_DUPLICATION_AUDIT.md       # Audit report microservices
├── 📄 MICROSERVICES_READY.md           # Production readiness report
├── 📄 README.md                        # Main documentation
│
├── 📁 openmusic-api/                   # 🎵 Producer Service (API Server)
│   ├── 📄 package.json                 # API Server dependencies (14 packages)
│   ├── 📄 package-lock.json           # NPM dependency lock file
│   ├── 📄 README.md                   # API Server documentation
│   ├── 📄 eslint.config.js           # ESLint configuration
│   ├── 📄 .env.example               # Environment template (producer config)
│   ├── 📄 .prettierrc                # Prettier code formatting config
│   ├── 📄 .gitignore                 # Git ignore patterns
│   ├── 📄 test-db.js                 # Database connection test
│   ├── 📄 setup-sample-data.js       # Sample data setup script
│   │
│   ├── 📁 src/                       # Source code utama
│   │   ├── 📄 server.js              # Entry point aplikasi (updated for microservices)
│   │   │
│   │   ├── 📁 handlers/              # 🌐 HTTP Request Handlers (Delivery Layer)
│   │   │   ├── 📄 BaseHandler.js     # Base handler dengan utility methods
│   │   │   ├── 📄 AlbumsHandler.js   # Handler untuk albums endpoints
│   │   │   ├── 📄 SongsHandler.js    # Handler untuk songs endpoints
│   │   │   ├── 📄 UsersHandler.js    # Handler untuk users endpoints
│   │   │   ├── 📄 AuthenticationsHandler.js # Handler untuk auth endpoints
│   │   │   ├── 📄 PlaylistsHandler.js # Handler untuk playlists endpoints
│   │   │   ├── 📄 CollaborationsHandler.js # Handler untuk collaborations
│   │   │   ├── 📄 ExportsHandler.js  # Handler untuk export playlists (producer only)
│   │   │   ├── 📄 UploadsHandler.js  # Handler untuk upload covers
│   │   │   └── 📄 AlbumLikesHandler.js # Handler untuk album likes
│   │   │
│   │   ├── 📁 services/              # 🔧 Business Logic Layer
│   │   │   ├── 📄 AlbumsService.js   # Business logic untuk albums (v3 updated)
│   │   │   ├── 📄 SongsService.js    # Business logic untuk songs
│   │   │   ├── 📄 UsersService.js    # Business logic untuk users
│   │   │   ├── 📄 AuthenticationsService.js # Business logic untuk auth
│   │   │   ├── 📄 PlaylistsService.js # Business logic untuk playlists
│   │   │   ├── 📄 CollaborationsService.js # Business logic untuk collaborations
│   │   │   ├── 📄 ExportsService.js  # Business logic untuk export (message producer)
│   │   │   └── 📄 AlbumLikesService.js # Business logic untuk album likes
│   │   │
│   │   ├── 📁 routes/                # 🛣️ Route Definitions
│   │   │   ├── 📄 albums.js          # Routes untuk albums
│   │   │   ├── 📄 songs.js           # Routes untuk songs
│   │   │   ├── 📄 users.js           # Routes untuk users
│   │   │   ├── 📄 authentications.js # Routes untuk auth
│   │   │   ├── 📄 playlists.js       # Routes untuk playlists
│   │   │   ├── 📄 collaborations.js  # Routes untuk collaborations
│   │   │   ├── 📄 exports.js         # Routes untuk export (producer endpoints)
│   │   │   └── 📄 uploads.js         # Routes untuk upload covers
│   │   │
│   │   ├── 📁 utils/                 # 🛠️ Utility Classes dan Helpers
│   │   │   ├── 📄 database.js        # Database connection pool
│   │   │   ├── 📄 ProducerService.js # RabbitMQ producer service
│   │   │   ├── 📄 StorageConfig.js   # Storage configuration (Local/S3)
│   │   │   ├── 📄 TokenManager.js    # JWT token management
│   │   │   ├── 📁 localStorage/      # Local storage implementation
│   │   │   ├── 📁 redis/             # Redis caching service
│   │   │   └── 📁 S3/               # AWS S3 storage service
│   │   │
│   │   ├── 📁 validator/             # 📝 Input Validation Schemas
│   │   │   ├── 📁 albums/            # Album validation schemas
│   │   │   ├── 📁 songs/             # Song validation schemas
│   │   │   ├── 📁 users/             # User validation schemas
│   │   │   ├── 📁 authentications/   # Auth validation schemas
│   │   │   ├── 📁 playlists/         # Playlist validation schemas
│   │   │   ├── 📁 collaborations/    # Collaboration validation schemas
│   │   │   ├── 📁 exports/           # Export validation schemas
│   │   │   └── 📁 uploads/           # Upload validation schemas
│   │   │
│   │   └── 📁 exceptions/            # 🚨 Custom Error Classes
│   │       ├── 📄 ClientError.js     # Base client error class
│   │       ├── 📄 InvariantError.js  # Business logic errors
│   │       ├── 📄 NotFoundError.js   # Resource not found errors
│   │       ├── 📄 AuthenticationError.js # Authentication errors
│   │       └── 📄 AuthorizationError.js # Authorization errors
│   │
│   ├── 📁 migrations/                # 🗄️ Database Migrations
│   ├── 📁 uploads/                   # 📁 File Upload Storage (Local)
│   └── 📁 docs/                      # 📚 API Documentation
│
├── 📁 export-service/                # 📧 Consumer Service (Export Service)
│   ├── 📄 package.json              # Export Service dependencies (4 packages)
│   ├── 📄 README.md                 # Export Service documentation
│   ├── 📄 .env.example             # Environment template (consumer config)
│   ├── 📄 .gitignore               # Git ignore patterns
│   │
│   └── 📁 src/                      # Source code export service
│       ├── 📄 index.js              # Main consumer application
│       ├── 📁 services/             # Business logic untuk export
│       │   ├── 📄 MailSender.js     # Email service
│       │   └── 📄 PlaylistsService.js # Database service untuk export
│       └── 📁 utils/                # Utilities
│           └── 📄 database.js       # Database connection untuk export
│
└── 📁 postman/                      # 🧪 API Testing Collections
    ├── 📄 Open Music API V3 Test.postman_collection.json
    └── 📄 OpenMusic API Test.postman_environment.json
```

│ │ ├── 📄 albums.js # Routes untuk albums endpoints
│ │ ├── 📄 songs.js # Routes untuk songs endpoints
│ │ ├── 📄 users.js # Routes untuk users endpoints
│ │ ├── 📄 authentications.js # Routes untuk auth endpoints
│ │ ├── 📄 playlists.js # Routes untuk playlists endpoints
│ │ ├── 📄 collaborations.js # Routes untuk collaborations
│ │ ├── 📄 exports.js # 🆕 V3: Routes untuk export playlists ⭐
│ │ └── 📄 uploads.js # 🆕 V3: Routes untuk upload covers ⭐
│ │
│ ├── 📁 validator/ # ✅ Input Validation
│ │ ├── 📁 albums/
│ │ │ ├── 📄 index.js # Validator untuk albums
│ │ │ └── 📄 schema.js # Joi schema untuk albums
│ │ ├── 📁 songs/
│ │ │ ├── 📄 index.js # Validator untuk songs
│ │ │ └── 📄 schema.js # Joi schema untuk songs
│ │ ├── 📁 users/
│ │ │ ├── 📄 index.js # Validator untuk users
│ │ │ └── 📄 schema.js # Joi schema untuk users
│ │ ├── 📁 authentications/
│ │ │ ├── 📄 index.js # Validator untuk auth
│ │ │ └── 📄 schema.js # Joi schema untuk auth
│ │ ├── 📁 playlists/
│ │ │ ├── 📄 index.js # Validator untuk playlists
│ │ │ └── 📄 schema.js # Joi schema untuk playlists
│ │ ├── 📁 collaborations/
│ │ │ ├── 📄 index.js # Validator untuk collaborations
│ │ │ └── 📄 schema.js # Joi schema untuk collaborations
│ │ ├── 📁 exports/ # 🆕 V3: Validator untuk exports ⭐
│ │ │ ├── 📄 index.js # Validator untuk export payloads
│ │ │ └── 📄 schema.js # Joi schema untuk export
│ │ └── 📁 uploads/ # 🆕 V3: Validator untuk uploads ⭐
│ │ ├── 📄 index.js # Validator untuk file uploads
│ │ └── 📄 schema.js # Joi schema untuk uploads
│ │
│ ├── 📁 utils/ # 🛠️ Utilities dan Helper Functions
│ │ ├── 📄 database.js # Database connection pool
│ │ ├── 📄 TokenManager.js # JWT token management
│ │ ├── 📄 ProducerService.js # 🆕 V3: Main RabbitMQ producer ⭐
│ │ ├── 📄 StorageConfig.js # 🆕 V3: Storage configuration factory ⭐
│ │ │
│ │ ├── 📁 redis/ # 🆕 V3: Redis Caching ⭐
│ │ │ └── 📄 RedisCacheService.js # Redis cache implementation
│ │ │
│ │ ├── 📁 rabbitmq/ # 🆕 V3: RabbitMQ Services ⭐
│ │ │ └── 📄 ProducerService.js # RabbitMQ producer service
│ │ │
│ │ ├── 📁 localStorage/ # 🆕 V3: Local Storage Service ⭐
│ │ │ └── 📄 LocalStorageService.js # Local file storage
│ │ │
│ │ └── 📁 S3/ # 🆕 V3: AWS S3 Storage ⭐
│ │ └── 📄 S3StorageService.js # Amazon S3 storage service
│ │
│ ├── 📁 uploads/ # 🆕 V3: Local File Storage ⭐
│ │ └── 📄 \*.jpg # Uploaded cover images (example)
│ │
│ └── 📁 exceptions/ # ❌ Custom Error Classes
│ ├── 📄 ClientError.js # Base client error class
│ ├── 📄 InvariantError.js # Validation error (400)
│ ├── 📄 NotFoundError.js # Resource not found (404)
│ ├── 📄 AuthenticationError.js # Authentication error (401)
│ └── 📄 AuthorizationError.js # Authorization error (403)
│
├── 📁 migrations/ # 🗄️ Database Migrations
│ ├── 📄 1685000000000_create-table-albums.js
│ ├── 📄 1685000000001_create-table-songs.js
│ ├── 📄 1749096666947_create-table-users.js
│ ├── 📄 1749096718050_create-table-playlists.js
│ ├── 📄 1749096746232_create-table-playlist-songs.js
│ ├── 📄 1749096773698_create-table-collaborations.js
│ ├── 📄 1749096815243_create-table-playlist-song-activities.js
│ ├── 📄 1749097002117_create-table-authentications.js
│ ├── 📄 1749097100000_add-cover-url-to-albums.js # 🆕 V3: Album covers ⭐
│ └── 📄 1749097200000_create-table-album-likes.js # 🆕 V3: Album likes ⭐
│
├── 📁 postman/ # 🧪 Testing Collection
│ ├── 📄 Open Music API V3 Test.postman_collection.json # 🆕 V3: Updated collection ⭐
│ └── 📄 OpenMusic API Test.postman_environment.json
│
└── 📁 docs/ # 📚 Documentation
├── 📄 CRITERIA_CHECKLIST.md # Submission criteria checklist (v3 updated)
├── 📄 PROJECT_STRUCTURE_GUIDE.md # Guide arsitektur proyek (file ini - v3 updated)
├── 📄 DATABASE_SCHEMA.md # Dokumentasi struktur database
├── 📄 TESTING_GUIDE.md # Panduan testing API (v3 updated)
├── 📄 API_EXAMPLES.md # Contoh penggunaan API
├── 📄 SETUP_GUIDE_V3.md # 🆕 V3: Complete setup guide ⭐
├── 📄 STORAGE_CONFIGURATION.md # 🆕 V3: Storage configuration guide ⭐
├── 📄 OPENMUSIC_V3_CHECKLIST.md # 🆕 V3: Implementation checklist ⭐
├── 📄 DOCUMENTATION_COMPLETION_SUMMARY.md # 🆕 V3: Documentation summary ⭐
└── 📁 image/ # 🖼️ Gambar dan diagram dokumentasi
└── 📄 View-Diagram.png # Diagram view database

````

---

## 🏛️ Layer Architecture

### 1. 🌐 Delivery Layer (Routes + Handlers + Consumer)

**Tanggung Jawab:**

- Menerima HTTP requests
- Parsing dan validasi input
- Memanggil service layer
- Mengembalikan HTTP responses
- **V3 New:** Message consumption (RabbitMQ consumer)

**File Terkait:**

- `routes/*.js` - Route definitions dengan method dan path
- `handlers/*Handler.js` - HTTP request processors
- **V3 New:** `consumer/index.js` - RabbitMQ message consumer
- **V3 New:** `consumer/MailSender.js` - Email service untuk export
- **V3 New:** `consumer/PlaylistsService.js` - Consumer playlist service

**Contoh Flow V3:**

```javascript
// routes/uploads.js - V3 Upload Cover
{
  method: "POST",
  path: "/albums/{id}/covers",
  handler: (request, h) => handler.postUploadImageHandler(request, h),
  options: {
    payload: {
      maxBytes: 512000, // 512KB limit
      multipart: true,
    },
  },
}

// handlers/UploadsHandler.js - V3 Upload Handler
async postUploadImageHandler(request, h) {
  try {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const coverUrl = this._storageService.generateUrl(filename);
    await this._albumsService.editAlbumCoverById(id, coverUrl);

    return this._createSuccessResponse(h, null, "Sampul berhasil diunggah", 201);
  } catch (error) {
    return this._handleError(error, h);
  }
}

// consumer/index.js - V3 RabbitMQ Consumer
channel.consume("export:playlist", async (message) => {
  try {
    const { playlistId, targetEmail } = JSON.parse(message.content.toString());
    const playlist = await playlistsService.getPlaylistById(playlistId);
    await mailSender.sendEmail(targetEmail, JSON.stringify(playlist));
  } catch (error) {
    console.error("❌ Export failed:", error);
  }
  channel.ack(message);
});
````

### 2. 🔧 Service Layer (Business Logic + Cache + Storage)

**Tanggung Jawab:**

- Implementasi business rules
- Koordinasi operasi kompleks
- Data transformation
- Error handling
- **V3 New:** Cache management (Redis)
- **V3 New:** File storage abstraction
- **V3 New:** Message broker integration

**File Terkait:**

- `services/*Service.js` - Business logic implementations
- **V3 New:** `services/AlbumLikesService.js` - Album likes dengan caching
- **V3 New:** `services/ExportsService.js` - Export playlist logic
- **V3 New:** `utils/redis/RedisCacheService.js` - Redis cache service
- **V3 New:** `utils/StorageConfig.js` - Storage configuration factory

**Contoh Implementation V3:**

```javascript
// services/AlbumLikesService.js - V3 dengan Caching
class AlbumLikesService {
  constructor(pool, cacheService) {
    this._pool = pool;
    this._cacheService = cacheService;
  }

  async getLikesCount(albumId) {
    await this.verifyAlbumExists(albumId);

    try {
      // Try cache first
      const result = await this._cacheService.get(`album_likes:${albumId}`);
      return { likes: parseInt(result), source: "cache" };
    } catch {
      // Fallback to database
      const query = {
        text: "SELECT COUNT(*) as likes FROM album_likes WHERE album_id = $1",
        values: [albumId],
      };
      const result = await this._pool.query(query);
      const likes = parseInt(result.rows[0].likes);

      // Cache for 30 minutes
      await this._cacheService.set(
        `album_likes:${albumId}`,
        likes.toString(),
        1800
      );
      return { likes, source: "database" };
    }
  }

  async addLike(userId, albumId) {
    // Business logic
    await this.verifyAlbumExists(albumId);
    await this.verifyUserNotLikedAlbum(userId, albumId);

    // Add like to database
    const query = {
      /* insert logic */
    };
    await this._pool.query(query);

    // Invalidate cache when data changes
    await this._cacheService.delete(`album_likes:${albumId}`);
  }
}

// utils/StorageConfig.js - V3 Storage Factory
export const createStorageService = () => {
  const storageType = process.env.STORAGE_TYPE || "local";

  switch (storageType) {
    case "s3":
      console.log("🚀 Using S3 Storage Service");
      return new S3StorageService();
    case "local":
    default:
      console.log("📁 Using Local Storage Service");
      return new LocalStorageService();
  }
};
```

### 3. 🗄️ Data Layer (Database + External Services)

**Tanggung Jawab:**

- Database operations (CRUD)
- Query optimization
- Transaction management
- Connection pooling
- **V3 New:** External service integration (S3, Redis, RabbitMQ)

**File Terkait:**

- `utils/database.js` - Database connection
- `migrations/*.js` - Schema definitions
- **V3 New:** `utils/S3/S3StorageService.js` - Amazon S3 integration
- **V3 New:** `utils/localStorage/LocalStorageService.js` - Local file storage
- **V3 New:** `utils/rabbitmq/ProducerService.js` - RabbitMQ producer

### 4. ✅ Validation Layer (Enhanced V3)

**Tanggung Jawab:**

- Input validation dengan Joi schemas
- Data sanitization
- Format validation
- **V3 New:** File upload validation
- **V3 New:** Email format validation

**File Terkait:**

- `validator/*/schema.js` - Joi schemas
- `validator/*/index.js` - Validation functions
- **V3 New:** `validator/uploads/` - File upload validation
- **V3 New:** `validator/exports/` - Export payload validation

**Contoh V3 Validation:**

```javascript
// validator/uploads/schema.js - V3 File Validation
const ImageHeadersSchema = Joi.object({
  "content-type": Joi.string()
    .valid(
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp"
    )
    .required(),
}).unknown();

// validator/exports/schema.js - V3 Export Validation
const ExportPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});
```

---

## 🏗️ Service Architecture

### **Producer Service (API Server) Architecture**

```
┌─────────────────────────────────────────┐
│           DELIVERY LAYER                │
│     (Routes, Handlers)                  │
├─────────────────────────────────────────┤
│          SERVICE LAYER                  │
│   (Business Logic, Cache, Storage)      │
├─────────────────────────────────────────┤
│         REPOSITORY LAYER                │
│     (Database Operations)               │
├─────────────────────────────────────────┤
│        EXTERNAL LAYER                   │
│  (PostgreSQL, Redis, RabbitMQ, S3)      │
└─────────────────────────────────────────┘
```

**Responsibilities:**

- REST API endpoints handling
- User authentication & authorization
- File upload processing (Local/S3)
- Redis caching management
- RabbitMQ message publishing
- Database operations (CRUD)

### **Consumer Service (Export Service) Architecture**

```
┌─────────────────────────────────────────┐
│           MESSAGE LAYER                 │
│     (RabbitMQ Consumer)                 │
├─────────────────────────────────────────┤
│          PROCESSING LAYER               │
│   (Email, Export Logic)                 │
├─────────────────────────────────────────┤
│         DATA ACCESS LAYER               │
│     (Database Read Operations)          │
├─────────────────────────────────────────┤
│        EXTERNAL LAYER                   │
│  (PostgreSQL, RabbitMQ, SMTP)           │
└─────────────────────────────────────────┘
```

**Responsibilities:**

- RabbitMQ message consumption
- Playlist data export processing
- Email composition & sending
- Background job processing
- Queue monitoring

## 🔄 Communication Flow

### **Service-to-Service Communication**

```
[Client] → [API Server] → [RabbitMQ] → [Export Service] → [Email]
    ↓           ↓              ↓              ↓            ↓
  REST API  Business Logic  Message Queue  Processing   SMTP Server
    ↓           ↓              ↓              ↓
[Response]  [Database]     [Message]     [Database]
              ↑                             ↑
              └─────── Shared Database ─────┘
```

### **Export Flow Example**

1. **Client Request** → `POST /export/playlists/{id}`
2. **API Server** → Validates ownership & permissions
3. **API Server** → Publishes message to RabbitMQ queue
4. **API Server** → Returns 201 response immediately
5. **Export Service** → Consumes message from queue
6. **Export Service** → Queries database for playlist data
7. **Export Service** → Generates JSON export
8. **Export Service** → Sends email with attachment
9. **Export Service** → Acknowledges message completion

## 🎨 Design Patterns

### **1. Microservices Pattern**

- **Service Independence**: Each service deployable separately
- **Technology Diversity**: Different tech stacks per service
- **Fault Isolation**: Service failures don't cascade

### **2. Producer-Consumer Pattern**

- **Async Processing**: Non-blocking export operations
- **Queue Management**: RabbitMQ handles message reliability
- **Load Balancing**: Multiple consumers can process queue

### **3. Shared Database Pattern**

- **Data Consistency**: Single source of truth
- **Read/Write Separation**: API server writes, Export service reads
- **Transaction Management**: Database handles ACID properties

### **4. Service Layer Pattern (API Server)**

- **Clean Architecture**: Separation of concerns
- **Dependency Injection**: Loose coupling between layers
- **Single Responsibility**: Each service class has one purpose

### **5. Repository Pattern**

- **Data Access Abstraction**: Hide database implementation details
- **Testability**: Easy to mock for unit testing
- **Flexibility**: Switch database implementations

### **6. Factory Pattern**

- **Storage Configuration**: Dynamic storage selection (Local/S3)
- **Cache Service**: Redis service instantiation
- **Service Creation**: Dynamic service instance creation

## ✅ Best Practices

### **🔒 Security**

- **JWT Authentication** dengan access & refresh tokens
- **Password hashing** menggunakan bcrypt
- **Input validation** untuk mencegah injection attacks
- **Authorization** untuk setiap protected endpoint
- **File upload security** dengan MIME type validation
- **Environment variable security** untuk sensitive data

### **📊 Performance**

- **Database connection pooling** untuk mengelola koneksi
- **Indexes** pada field yang sering di-query
- **Query optimization** dengan prepared statements
- **Server-side caching** dengan Redis (30 menit TTL)
- **Cache invalidation** saat data berubah
- **Asynchronous processing** dengan RabbitMQ

### **🧪 Testing**

- **Unit tests** untuk setiap service method
- **Integration tests** untuk API endpoints
- **Postman collection** untuk manual testing
- **Error scenario testing**
- **Cache behavior testing**
- **Message queue testing**

### **📝 Code Quality**

- **ESLint** untuk code consistency
- **Prettier** untuk code formatting
- **Descriptive naming** untuk variables dan functions
- **Modular architecture** untuk reusability
- **Error messages** yang informatif

### **🔧 Maintenance**

- **Database migrations** untuk version control schema
- **Environment variables** untuk configuration
- **Logging** untuk monitoring dan debugging
- **Documentation** yang up-to-date
- **Health checks** untuk services
- **Graceful error handling** untuk external services

### **🌩️ Cloud Ready**

- **AWS SDK v3** integration untuk modern cloud services
- **S3 storage** untuk scalable file storage
- **Environment-based configuration** untuk multi-stage deployment
- **Container-friendly** architecture
- **Horizontal scaling** support dengan stateless design

---

**🏗️ Project Structure Guide** - _Arsitektur microservices yang clean, maintainable, dan scalable untuk OpenMusic API v3 dengan fitur modern: caching, async processing, cloud storage, dan production-ready deployment_
