# 🏗️ Project Structure Guide - OpenMusic API v3

Panduan lengkap arsitektur dan struktur proyek OpenMusic API v3 menggunakan Clean Architecture pattern dengan Node.js dan Hapi.js framework, termasuk fitur v3 terbaru: export playlist, upload cover, album likes, dan caching.

## 📋 Daftar Isi

- [Arsitektur Overview](#-arsitektur-overview)
- [Struktur Folder](#-struktur-folder)
- [Layer Architecture](#-layer-architecture)
- [Dependency Flow](#-dependency-flow)
- [Design Patterns](#-design-patterns)
- [Best Practices](#-best-practices)

## 🎯 Arsitektur Overview

OpenMusic API v3 mengimplementasikan **Clean Architecture** yang memisahkan concerns ke dalam layer-layer yang independen, dengan tambahan fitur v3:

```
┌─────────────────────────────────────────┐
│           DELIVERY LAYER                │
│     (Routes, Handlers, Consumer)        │
├─────────────────────────────────────────┤
│          SERVICE LAYER                  │
│   (Business Logic, Cache, Storage)      │
├─────────────────────────────────────────┤
│         REPOSITORY LAYER                │
│     (Database Operations)               │
├─────────────────────────────────────────┤
│        EXTERNAL LAYER                   │
│  (Database, JWT, Redis, RabbitMQ, S3)   │
└─────────────────────────────────────────┘
```

**Keuntungan Clean Architecture:**

- 🔄 **Maintainable** - Mudah dimodifikasi dan dikembangkan
- 🧪 **Testable** - Setiap layer dapat ditest secara independen
- 🔀 **Flexible** - Framework dan database dapat diganti tanpa mengubah business logic
- 📦 **Modular** - Setiap komponen memiliki tanggung jawab yang jelas
- ⚡ **Scalable** - Support caching, async processing, dan cloud storage

---

## 📁 Struktur Folder

```
openmusic-api/
├── 📄 package.json                    # Dependencies dan scripts (v3 updated)
├── 📄 package-lock.json               # NPM dependency lock file
├── 📄 README.md                       # Dokumentasi utama proyek (v3 updated)
├── 📄 eslint.config.js               # ESLint configuration
├── 📄 .env.example                   # Template environment variables (v3 updated)
├── 📄 .prettierrc                    # Prettier code formatting config
├── 📄 .pgmigraterc                   # PostgreSQL migration configuration
├── 📄 .gitignore                     # Git ignore patterns
├── 📄 test-db.js                     # Script test koneksi database
├── 📄 setup-sample-data.js           # Script setup data sample
├── 📁 .git/                          # Git repository metadata
├── 📁 node_modules/                  # NPM dependencies (auto-generated)
│
├── 📁 src/                           # Source code utama
│   ├── 📄 server.js                  # Entry point aplikasi (v3 updated)
│   │
│   ├── 📁 consumer/                  # 🆕 V3: Message Consumer for Export ⭐
│   │   ├── 📄 index.js               # RabbitMQ consumer main file
│   │   ├── 📄 MailSender.js          # Email service untuk export
│   │   └── 📄 PlaylistsService.js    # Consumer playlist service
│   │
│   ├── 📁 handlers/                  # 🌐 HTTP Request Handlers (Delivery Layer)
│   │   ├── 📄 BaseHandler.js         # Base handler dengan utility methods
│   │   ├── 📄 AlbumsHandler.js       # Handler untuk albums endpoints
│   │   ├── 📄 SongsHandler.js        # Handler untuk songs endpoints
│   │   ├── 📄 UsersHandler.js        # Handler untuk users endpoints
│   │   ├── 📄 AuthenticationsHandler.js # Handler untuk auth endpoints
│   │   ├── 📄 PlaylistsHandler.js    # Handler untuk playlists endpoints
│   │   ├── 📄 CollaborationsHandler.js # Handler untuk collaborations
│   │   ├── 📄 ExportsHandler.js      # 🆕 V3: Handler untuk export playlists ⭐
│   │   ├── 📄 UploadsHandler.js      # 🆕 V3: Handler untuk upload covers ⭐
│   │   └── 📄 AlbumLikesHandler.js   # 🆕 V3: Handler untuk album likes ⭐
│   │
│   ├── 📁 services/                  # 🔧 Business Logic Layer
│   │   ├── 📄 AlbumsService.js       # Business logic untuk albums (v3 updated)
│   │   ├── 📄 SongsService.js        # Business logic untuk songs
│   │   ├── 📄 UsersService.js        # Business logic untuk users
│   │   ├── 📄 AuthenticationsService.js # Business logic untuk auth
│   │   ├── 📄 PlaylistsService.js    # Business logic untuk playlists
│   │   ├── 📄 CollaborationsService.js # Business logic untuk collaborations
│   │   ├── 📄 ExportsService.js      # 🆕 V3: Business logic untuk export ⭐
│   │   └── 📄 AlbumLikesService.js   # 🆕 V3: Business logic untuk album likes ⭐
│   │
│   ├── 📁 routes/                    # 🛣️ Route Definitions
│   │   ├── 📄 albums.js              # Routes untuk albums endpoints
│   │   ├── 📄 songs.js               # Routes untuk songs endpoints
│   │   ├── 📄 users.js               # Routes untuk users endpoints
│   │   ├── 📄 authentications.js     # Routes untuk auth endpoints
│   │   ├── 📄 playlists.js          # Routes untuk playlists endpoints
│   │   ├── 📄 collaborations.js     # Routes untuk collaborations
│   │   ├── 📄 exports.js            # 🆕 V3: Routes untuk export playlists ⭐
│   │   └── 📄 uploads.js            # 🆕 V3: Routes untuk upload covers ⭐
│   │
│   ├── 📁 validator/                 # ✅ Input Validation
│   │   ├── 📁 albums/
│   │   │   ├── 📄 index.js           # Validator untuk albums
│   │   │   └── 📄 schema.js          # Joi schema untuk albums
│   │   ├── 📁 songs/
│   │   │   ├── 📄 index.js           # Validator untuk songs
│   │   │   └── 📄 schema.js          # Joi schema untuk songs
│   │   ├── 📁 users/
│   │   │   ├── 📄 index.js           # Validator untuk users
│   │   │   └── 📄 schema.js          # Joi schema untuk users
│   │   ├── 📁 authentications/
│   │   │   ├── 📄 index.js           # Validator untuk auth
│   │   │   └── 📄 schema.js          # Joi schema untuk auth
│   │   ├── 📁 playlists/
│   │   │   ├── 📄 index.js           # Validator untuk playlists
│   │   │   └── 📄 schema.js          # Joi schema untuk playlists
│   │   ├── 📁 collaborations/
│   │   │   ├── 📄 index.js           # Validator untuk collaborations
│   │   │   └── 📄 schema.js          # Joi schema untuk collaborations
│   │   ├── 📁 exports/               # 🆕 V3: Validator untuk exports ⭐
│   │   │   ├── 📄 index.js           # Validator untuk export payloads
│   │   │   └── 📄 schema.js          # Joi schema untuk export
│   │   └── 📁 uploads/               # 🆕 V3: Validator untuk uploads ⭐
│   │       ├── 📄 index.js           # Validator untuk file uploads
│   │       └── 📄 schema.js          # Joi schema untuk uploads
│   │
│   ├── 📁 utils/                     # 🛠️ Utilities dan Helper Functions
│   │   ├── 📄 database.js            # Database connection pool
│   │   ├── 📄 TokenManager.js        # JWT token management
│   │   ├── 📄 ProducerService.js     # 🆕 V3: Main RabbitMQ producer ⭐
│   │   ├── 📄 StorageConfig.js       # 🆕 V3: Storage configuration factory ⭐
│   │   │
│   │   ├── 📁 redis/                 # 🆕 V3: Redis Caching ⭐
│   │   │   └── 📄 RedisCacheService.js # Redis cache implementation
│   │   │
│   │   ├── 📁 rabbitmq/             # 🆕 V3: RabbitMQ Services ⭐
│   │   │   └── 📄 ProducerService.js # RabbitMQ producer service
│   │   │
│   │   ├── 📁 localStorage/         # 🆕 V3: Local Storage Service ⭐
│   │   │   └── 📄 LocalStorageService.js # Local file storage
│   │   │
│   │   └── 📁 S3/                   # 🆕 V3: AWS S3 Storage ⭐
│   │       └── 📄 S3StorageService.js # Amazon S3 storage service
│   │
│   ├── 📁 uploads/                   # 🆕 V3: Local File Storage ⭐
│   │   └── 📄 *.jpg                  # Uploaded cover images (example)
│   │
│   └── 📁 exceptions/                # ❌ Custom Error Classes
│       ├── 📄 ClientError.js         # Base client error class
│       ├── 📄 InvariantError.js      # Validation error (400)
│       ├── 📄 NotFoundError.js       # Resource not found (404)
│       ├── 📄 AuthenticationError.js # Authentication error (401)
│       └── 📄 AuthorizationError.js  # Authorization error (403)
│
├── 📁 migrations/                    # 🗄️ Database Migrations
│   ├── 📄 1685000000000_create-table-albums.js
│   ├── 📄 1685000000001_create-table-songs.js
│   ├── 📄 1749096666947_create-table-users.js
│   ├── 📄 1749096718050_create-table-playlists.js
│   ├── 📄 1749096746232_create-table-playlist-songs.js
│   ├── 📄 1749096773698_create-table-collaborations.js
│   ├── 📄 1749096815243_create-table-playlist-song-activities.js
│   ├── 📄 1749097002117_create-table-authentications.js
│   ├── 📄 1749097100000_add-cover-url-to-albums.js    # 🆕 V3: Album covers ⭐
│   └── 📄 1749097200000_create-table-album-likes.js   # 🆕 V3: Album likes ⭐
│
├── 📁 postman/                       # 🧪 Testing Collection
│   ├── 📄 Open Music API V3 Test.postman_collection.json # 🆕 V3: Updated collection ⭐
│   └── 📄 OpenMusic API Test.postman_environment.json
│
└── 📁 docs/                          # 📚 Documentation
    ├── 📄 CRITERIA_CHECKLIST.md      # Submission criteria checklist (v3 updated)
    ├── 📄 PROJECT_STRUCTURE_GUIDE.md # Guide arsitektur proyek (file ini - v3 updated)
    ├── 📄 DATABASE_SCHEMA.md         # Dokumentasi struktur database
    ├── 📄 TESTING_GUIDE.md           # Panduan testing API (v3 updated)
    ├── 📄 API_EXAMPLES.md            # Contoh penggunaan API
    ├── 📄 SETUP_GUIDE_V3.md          # 🆕 V3: Complete setup guide ⭐
    ├── 📄 STORAGE_CONFIGURATION.md   # 🆕 V3: Storage configuration guide ⭐
    ├── 📄 OPENMUSIC_V3_CHECKLIST.md  # 🆕 V3: Implementation checklist ⭐
    ├── 📄 DOCUMENTATION_COMPLETION_SUMMARY.md # 🆕 V3: Documentation summary ⭐
    └── 📁 image/                     # 🖼️ Gambar dan diagram dokumentasi
        └── 📄 View-Diagram.png       # Diagram view database
```

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
```

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

## 🔄 Dependency Flow (Enhanced V3)

Clean Architecture mengikuti **Dependency Inversion Principle** dengan tambahan V3:

```
Handlers → Services → Database
   ↓         ↓         ↓
Consumer → Cache → External Services (Redis, S3, RabbitMQ)
   ↓         ↓         ↓
Depend on abstractions, not concretions
```

**Keuntungan V3:**

- Services tidak bergantung pada framework tertentu
- Database dapat diganti tanpa mengubah business logic
- Storage dapat switching antara local dan S3
- Cache dapat di-disable tanpa merusak functionality
- Message broker dapat diganti tanpa mengubah business logic
- Testing menjadi lebih mudah dengan dependency injection

**V3 Dependency Examples:**

```javascript
// Flexible Storage Dependency
const storageService = createStorageService(); // Local atau S3
const uploadsHandler = new UploadsHandler(
  storageService,
  albumsService,
  validator
);

// Cache Dependency Injection
const cacheService = new CacheService();
const albumLikesService = new AlbumLikesService(pool, cacheService);

// Message Broker Dependency
const exportsService = new ExportsService(playlistsService);
const exportsHandler = new ExportsHandler(exportsService, validator);
```

---

## 🎨 Design Patterns (Enhanced V3)

### 1. **Service Pattern (Enhanced)**

Setiap domain memiliki service class tersendiri dengan dependency injection:

```javascript
// V3 Enhanced Service Pattern
class AlbumLikesService {
  constructor(pool, cacheService) {
    this._pool = pool;
    this._cacheService = cacheService;
  }
}

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService; // Abstraction
    this._albumsService = albumsService;
    this._validator = validator;
  }
}
```

### 2. **Repository Pattern (Enhanced)**

Service layer berinteraksi dengan external services melalui abstraction:

```javascript
// V3 Storage Abstraction
interface StorageService {
  writeFile(file, meta);
  generateUrl(filename);
  deleteFile(filename);
}

// Implementation bisa Local atau S3
class LocalStorageService implements StorageService { }
class S3StorageService implements StorageService { }
```

### 3. **Factory Pattern (New V3)**

Dynamic service creation berdasarkan configuration:

```javascript
// utils/StorageConfig.js
export const createStorageService = () => {
  const storageType = process.env.STORAGE_TYPE || "local";

  switch (storageType) {
    case "s3":
      return new S3StorageService();
    case "local":
    default:
      return new LocalStorageService();
  }
};
```

### 4. **Cache-Aside Pattern (New V3)**

Caching strategy untuk performance optimization:

```javascript
// Try cache first, fallback to database
async getLikesCount(albumId) {
  try {
    const cached = await this._cacheService.get(`album_likes:${albumId}`);
    return { likes: parseInt(cached), source: "cache" };
  } catch {
    const dbResult = await this._pool.query(query);
    const likes = parseInt(dbResult.rows[0].likes);

    // Cache for future requests
    await this._cacheService.set(`album_likes:${albumId}`, likes.toString(), 1800);
    return { likes, source: "database" };
  }
}
```

### 5. **Producer-Consumer Pattern (New V3)**

Asynchronous message processing:

```javascript
// Producer (API Handler)
await ProducerService.sendMessage("export:playlist", {
  playlistId,
  targetEmail,
});

// Consumer (Background Process)
channel.consume("export:playlist", async (message) => {
  const { playlistId, targetEmail } = JSON.parse(message.content.toString());
  // Process export...
});
```

### 6. **Error Handling Pattern (Enhanced)**

Consistent error handling dengan custom exception:

```javascript
// V3 Enhanced Error Handling
if (!result.rows.length) {
  throw new NotFoundError("Album tidak ditemukan");
}

// File validation errors
if (!cover) {
  throw new InvariantError("Cover file is required");
}
```

---

## ✅ Best Practices (Enhanced V3)

### 🔒 Security (Enhanced)

- **JWT Authentication** dengan access & refresh tokens
- **Password hashing** menggunakan bcrypt
- **Input validation** untuk mencegah injection attacks
- **Authorization** untuk setiap protected endpoint
- **File upload security** dengan MIME type validation
- **Rate limiting** untuk API endpoints
- **CORS configuration** untuk cross-origin requests

### 📊 Performance (New V3)

- **Database connection pooling** untuk mengelola koneksi
- **Indexes** pada field yang sering di-query
- **Query optimization** dengan prepared statements
- **Pagination** untuk list endpoints
- **Server-side caching** dengan Redis (30 menit TTL)
- **Cache invalidation** saat data berubah
- **Asynchronous processing** dengan RabbitMQ
- **CDN-ready** file serving untuk static assets

### 🧪 Testing (Enhanced)

- **Unit tests** untuk setiap service method
- **Integration tests** untuk API endpoints
- **Postman collection** untuk manual testing
- **Error scenario testing**
- **Cache behavior testing**
- **File upload testing** (size, MIME type)
- **Message queue testing**
- **Storage switching testing** (Local ↔ S3)

### 📝 Code Quality (Enhanced)

- **ESLint** untuk code consistency
- **Prettier** untuk code formatting
- **Descriptive naming** untuk variables dan functions
- **Modular architecture** untuk reusability
- **Error messages** yang informatif
- **Type checking** dengan JSDoc
- **Documentation** untuk setiap public method

### 🔧 Maintenance (Enhanced)

- **Database migrations** untuk version control schema
- **Environment variables** untuk configuration
- **Logging** untuk monitoring dan debugging
- **Documentation** yang up-to-date
- **Health checks** untuk services (Redis, RabbitMQ)
- **Graceful error handling** untuk external services
- **Monitoring** untuk cache hit rates
- **Backup strategies** untuk file storage

### 🌩️ Cloud Ready (New V3)

- **AWS SDK v3** integration untuk modern cloud services
- **S3 storage** untuk scalable file storage
- **Environment-based configuration** untuk multi-stage deployment
- **Container-friendly** architecture
- **Horizontal scaling** support dengan stateless design
- **External service health checks**

---

## 🚀 Getting Started (Updated V3)

1. **Clone Repository**

   ```bash
   git clone <repository-url>
   cd openmusic-api
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment (V3 Enhanced)**

   ```bash
   cp .env.example .env
   # Edit .env dengan konfigurasi V3:

   # Database
   PGUSER=postgres
   PGPASSWORD=your_password
   PGDATABASE=openmusic_api

   # JWT
   ACCESS_TOKEN_KEY=your_access_token_key
   REFRESH_TOKEN_KEY=your_refresh_token_key

   # Redis (V3 Required)
   REDIS_SERVER=127.0.0.1

   # RabbitMQ (V3 Required)
   RABBITMQ_SERVER=amqp://localhost

   # SMTP (V3 Required untuk Export)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password

   # Storage (V3 New)
   STORAGE_TYPE=local # atau 's3'

   # AWS S3 (V3 Optional)
   AWS_BUCKET_NAME=your_bucket_name
   AWS_REGION=ap-southeast-1
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

4. **Setup Services (V3 Required)**

   ```bash
   # Start Redis
   redis-server

   # Start RabbitMQ
   rabbitmq-server

   # Verify services
   redis-cli ping          # Should return PONG
   rabbitmqctl status      # Should show running
   ```

5. **Setup Database**

   ```bash
   npm run migrate:up
   npm run setup:sample
   ```

6. **Start Development (V3 Enhanced)**

   ```bash
   # Terminal 1: API Server
   npm run dev

   # Terminal 2: Consumer (V3 New)
   npm run dev:consumer
   ```

   **Expected Console Output:**

   ```
   📁 Using Local Storage Service
   ✅ Redis connected successfully
   ✅ Database connected successfully
   Server running on http://localhost:5000
   Consumer ready to process export requests
   ```

## 🆕 V3 New Features Architecture

### 📤 Export Playlist Flow

```
API Request → ExportsHandler → ExportsService → RabbitMQ Producer
                                                      ↓
Consumer Process ← MailSender ← PlaylistsService ← RabbitMQ Consumer
```

### 🖼️ Upload Cover Flow

```
Multipart Upload → UploadsHandler → Validation → Storage Service
                                                        ↓
                                              Local Storage / S3
                                                        ↓
                                            Album Service → Database
```

### ❤️ Album Likes with Cache Flow

```
API Request → AlbumLikesHandler → AlbumLikesService → Check Cache
                                                           ↓
                                                  Cache Hit: Return
                                                           ↓
                                             Cache Miss: Database Query
                                                           ↓
                                                Store in Cache (30min)
```

---

**🏗️ Project Structure Guide** - _Arsitektur yang clean, maintainable, dan scalable untuk OpenMusic API v3 dengan fitur modern: caching, async processing, cloud storage, dan production-ready deployment_
