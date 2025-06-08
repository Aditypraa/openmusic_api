# 🏗️ Project Structure Guide - OpenMusic API v2

Panduan lengkap arsitektur dan struktur proyek OpenMusic API v2 menggunakan Clean Architecture pattern dengan Node.js dan Hapi.js framework.

## 📋 Daftar Isi

- [Arsitektur Overview](#-arsitektur-overview)
- [Struktur Folder](#-struktur-folder)
- [Layer Architecture](#-layer-architecture)
- [Dependency Flow](#-dependency-flow)
- [Design Patterns](#-design-patterns)
- [Best Practices](#-best-practices)

## 🎯 Arsitektur Overview

OpenMusic API v2 mengimplementasikan **Clean Architecture** yang memisahkan concerns ke dalam layer-layer yang independen:

```
┌─────────────────────────────────────────┐
│           DELIVERY LAYER                │
│        (Routes, Handlers)               │
├─────────────────────────────────────────┤
│          SERVICE LAYER                  │
│       (Business Logic)                  │
├─────────────────────────────────────────┤
│         REPOSITORY LAYER                │
│     (Database Operations)               │
├─────────────────────────────────────────┤
│        EXTERNAL LAYER                   │
│    (Database, JWT, External APIs)      │
└─────────────────────────────────────────┘
```

**Keuntungan Clean Architecture:**

- 🔄 **Maintainable** - Mudah dimodifikasi dan dikembangkan
- 🧪 **Testable** - Setiap layer dapat ditest secara independen
- 🔀 **Flexible** - Framework dan database dapat diganti tanpa mengubah business logic
- 📦 **Modular** - Setiap komponen memiliki tanggung jawab yang jelas

---

## 📁 Struktur Folder

```
openmusic-api/
├── 📄 package.json                    # Dependencies dan scripts
├── 📄 package-lock.json               # NPM dependency lock file
├── 📄 README.md                       # Dokumentasi utama proyek
├── 📄 eslint.config.js               # ESLint configuration
├── 📄 .env.example                   # Template environment variables
├── 📄 .prettierrc                    # Prettier code formatting config
├── 📄 .pgmigraterc                   # PostgreSQL migration configuration
├── 📄 .gitignore                     # Git ignore patterns
├── 📄 test-db.js                     # Script test koneksi database
├── 📄 setup-sample-data.js           # Script setup data sample
├── 📁 .git/                          # Git repository metadata
├── 📁 node_modules/                  # NPM dependencies (auto-generated)
│
├── 📁 src/                           # Source code utama
│   ├── 📄 server.js                  # Entry point aplikasi
│   │
│   ├── 📁 handlers/                  # 🌐 HTTP Request Handlers (Delivery Layer)
│   │   ├── 📄 BaseHandler.js         # Base handler dengan utility methods
│   │   ├── 📄 AlbumsHandler.js       # Handler untuk albums endpoints
│   │   ├── 📄 SongsHandler.js        # Handler untuk songs endpoints
│   │   ├── 📄 UsersHandler.js        # Handler untuk users endpoints
│   │   ├── 📄 AuthenticationsHandler.js # Handler untuk auth endpoints
│   │   ├── 📄 PlaylistsHandler.js    # Handler untuk playlists endpoints
│   │   └── 📄 CollaborationsHandler.js # Handler untuk collaborations
│   │
│   ├── 📁 services/                  # 🔧 Business Logic Layer
│   │   ├── 📄 AlbumsService.js       # Business logic untuk albums
│   │   ├── 📄 SongsService.js        # Business logic untuk songs
│   │   ├── 📄 UsersService.js        # Business logic untuk users
│   │   ├── 📄 AuthenticationsService.js # Business logic untuk auth
│   │   ├── 📄 PlaylistsService.js    # Business logic untuk playlists
│   │   └── 📄 CollaborationsService.js # Business logic untuk collaborations
│   │
│   ├── 📁 routes/                    # 🛣️ Route Definitions
│   │   ├── 📄 albums.js              # Routes untuk albums endpoints
│   │   ├── 📄 songs.js               # Routes untuk songs endpoints
│   │   ├── 📄 users.js               # Routes untuk users endpoints
│   │   ├── 📄 authentications.js     # Routes untuk auth endpoints
│   │   ├── 📄 playlists.js          # Routes untuk playlists endpoints
│   │   └── 📄 collaborations.js     # Routes untuk collaborations
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
│   │   └── 📁 collaborations/
│   │       ├── 📄 index.js           # Validator untuk collaborations
│   │       └── 📄 schema.js          # Joi schema untuk collaborations
│   │
│   ├── 📁 utils/                     # 🛠️ Utilities dan Helper Functions
│   │   ├── 📄 database.js            # Database connection pool
│   │   └── 📄 TokenManager.js        # JWT token management
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
│   └── 📄 1749097002117_create-table-authentications.js
│
├── 📁 postman/                       # 🧪 Testing Collection
│   ├── 📄 Open Music API V2 Test.postman_collection.json
│   └── 📄 OpenMusic API Test.postman_environment.json
│
└── 📁 docs/                          # 📚 Documentation
    ├── 📄 CRITERIA_CHECKLIST.md      # Submission criteria checklist
    ├── 📄 PROJECT_STRUCTURE_GUIDE.md # Guide arsitektur proyek (file ini)
    ├── 📄 DATABASE_SCHEMA.md         # Dokumentasi struktur database
    ├── 📄 TESTING_GUIDE.md           # Panduan testing API
    ├── 📄 API_EXAMPLES.md            # Contoh penggunaan API
    └── 📁 image/                     # 🖼️ Gambar dan diagram dokumentasi
        └── 📄 View-Diagram.png       # Diagram view database
```

---

## 🏛️ Layer Architecture

### 1. 🌐 Delivery Layer (Routes + Handlers)

**Tanggung Jawab:**

- Menerima HTTP requests
- Parsing dan validasi input
- Memanggil service layer
- Mengembalikan HTTP responses

**File Terkait:**

- `routes/*.js` - Route definitions dengan method dan path
- `handlers/*Handler.js` - HTTP request processors

**Contoh Flow:**

```javascript
// routes/albums.js
{
  method: "POST",
  path: "/albums",
  handler: (request, h) => handler.postAlbumHandler(request, h),
}

// handlers/AlbumsHandler.js
async postAlbumHandler(request, h) {
  try {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    return this._createSuccessResponse(
      h,
      { albumId },
      "Album berhasil ditambahkan",
      201
    );
  } catch (error) {
    return this._handleError(error, h);
  }
}
```

### 2. 🔧 Service Layer (Business Logic)

**Tanggung Jawab:**

- Implementasi business rules
- Koordinasi operasi kompleks
- Data transformation
- Error handling

**File Terkait:**

- `services/*Service.js` - Business logic implementations

**Contoh Implementation:**

```javascript
// services/AlbumsService.js
class AlbumsService {
  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }
}
```

### 3. 🗄️ Data Layer (Database)

**Tanggung Jawab:**

- Database operations (CRUD)
- Query optimization
- Transaction management
- Connection pooling

**File Terkait:**

- `utils/database.js` - Database connection
- `migrations/*.js` - Schema definitions

### 4. ✅ Validation Layer

**Tanggung Jawab:**

- Input validation dengan Joi schemas
- Data sanitization
- Format validation

**File Terkait:**

- `validator/*/schema.js` - Joi schemas
- `validator/*/index.js` - Validation functions

---

## 🔄 Dependency Flow

Clean Architecture mengikuti **Dependency Inversion Principle**:

```
Handlers → Services → Database
   ↓         ↓         ↓
Depend on abstractions, not concretions
```

**Keuntungan:**

- Services tidak bergantung pada framework tertentu
- Database dapat diganti tanpa mengubah business logic
- Testing menjadi lebih mudah dengan dependency injection

---

## 🎨 Design Patterns

### 1. **Service Pattern**

Setiap domain memiliki service class tersendiri:

```javascript
class PlaylistsService {
  constructor(pool, collaborationService) {
    this._pool = pool;
    this._collaborationService = collaborationService;
  }
}
```

### 2. **Repository Pattern**

Service layer berinteraksi dengan database melalui abstraction:

```javascript
// Service tidak tahu detail implementasi database
const result = await this._pool.query(query);
```

### 3. **Error Handling Pattern**

Consistent error handling dengan custom exception:

```javascript
if (!result.rows.length) {
  throw new NotFoundError("Playlist tidak ditemukan");
}
```

### 4. **Validation Pattern**

Centralized validation dengan Joi schemas:

```javascript
const validationResult = PlaylistPayloadSchema.validate(payload);
if (validationResult.error) {
  throw new InvariantError(validationResult.error.message);
}
```

---

## ✅ Best Practices

### 🔒 Security

- **JWT Authentication** dengan access & refresh tokens
- **Password hashing** menggunakan bcrypt
- **Input validation** untuk mencegah injection attacks
- **Authorization** untuk setiap protected endpoint

### 📊 Performance

- **Database connection pooling** untuk mengelola koneksi
- **Indexes** pada field yang sering di-query
- **Query optimization** dengan prepared statements
- **Pagination** untuk list endpoints

### 🧪 Testing

- **Unit tests** untuk setiap service method
- **Integration tests** untuk API endpoints
- **Postman collection** untuk manual testing
- **Error scenario testing**

### 📝 Code Quality

- **ESLint** untuk code consistency
- **Descriptive naming** untuk variables dan functions
- **Modular architecture** untuk reusability
- **Error messages** yang informatif

### 🔧 Maintenance

- **Database migrations** untuk version control schema
- **Environment variables** untuk configuration
- **Logging** untuk monitoring dan debugging
- **Documentation** yang up-to-date

---

## 🚀 Getting Started

1. **Clone Repository**

   ```bash
   git clone <repository-url>
   cd openmusic-api
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment**

   ```bash
   cp .env.example .env
   # Edit .env dengan konfigurasi Anda
   ```

4. **Setup Database**

   ```bash
   npm run migrate:up
   npm run setup:sample
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

---

**🏗️ Project Structure Guide** - _Arsitektur yang clean, maintainable, dan scalable untuk OpenMusic API v2_
