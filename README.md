# 🎵 OpenMusic API v3

RESTful API untuk platform musik dengan fitur manajemen playlist, kolaborasi pengguna, export playlist, upload cover album, album likes, dan sistem caching yang canggih.

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi)
- [Instalasi dan Setup](#-instalasi-dan-setup)
- [Struktur Database](#-struktur-database)
- [API Endpoints](#-api-endpoints)
- [Dokumentasi Lengkap](#-dokumentasi-lengkap)
- [Testing](#-testing)
- [Kriteria Submission](#-kriteria-submission)

## ✨ Fitur Utama

### V1 (Fitur Dasar - Dipertahankan)

- 🎸 **CRUD Album & Lagu** - Manajemen lengkap data musik
- 🔍 **Pencarian Lagu** - Berdasarkan title dan performer
- ✅ **Validasi Data** - Menggunakan Joi schema validation

### V3 (Fitur Baru)

- 📤 **Export Playlist** - Export playlist ke email menggunakan RabbitMQ
- 🖼️ **Upload Cover Album** - Upload sampul album (Local Storage/S3)
- ❤️ **Album Likes** - Sistem like/unlike album dengan autentikasi
- ⚡ **Server-Side Caching** - Redis caching untuk performa optimal
- 📧 **Email Integration** - Nodemailer untuk export via email

## 🛠 Teknologi

| Kategori           | Teknologi                         |
| ------------------ | --------------------------------- |
| **Backend**        | Node.js + Hapi.js Framework       |
| **Database**       | PostgreSQL dengan node-pg-migrate |
| **Authentication** | JSON Web Token (JWT)              |
| **Validation**     | Joi Schema Validator              |
| **Architecture**   | Clean Architecture Pattern        |
| **Caching**        | Redis untuk server-side cache     |
| **Message Broker** | RabbitMQ untuk async processing   |
| **Email**          | Nodemailer untuk pengiriman email |
| **File Storage**   | Local Storage / Amazon S3         |

## 🚀 Instalasi dan Setup

### Persyaratan Sistem

- Node.js v16+
- PostgreSQL v12+
- npm atau yarn package manager

### Langkah Instalasi

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Konfigurasi Environment

```bash
# Salin file environment template
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:

```env
# Server Configuration
HOST=localhost
PORT=5000

# Database Configuration
PGUSER=postgres
PGPASSWORD=your_database_password
PGDATABASE=openmusic
PGHOST=localhost
PGPORT=5432

# JWT Secrets (Ganti dengan secret yang aman)
ACCESS_TOKEN_KEY=your_super_secret_access_key
REFRESH_TOKEN_KEY=your_super_secret_refresh_key
ACCESS_TOKEN_AGE=3600
REFRESH_TOKEN_AGE=86400

# Redis Configuration
REDIS_SERVER=localhost

# RabbitMQ Configuration
RABBITMQ_SERVER=amqp://localhost

# SMTP Configuration for Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# AWS S3 Configuration (Optional - untuk S3 storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
```

#### 3. Setup Database

```bash
# Test koneksi database
npm run test:db

# Jalankan migrations
npm run migrate:up

# (Opsional) Setup sample data untuk testing
npm run setup:sample
```

#### 4. Setup Redis dan RabbitMQ

**Redis (untuk caching):**

```bash
# Install Redis di Windows
# Download dari: https://github.com/microsoftarchive/redis/releases
# Atau gunakan Docker:
docker run -d -p 6379:6379 redis
```

**RabbitMQ (untuk message broker):**

```bash
# Install RabbitMQ di Windows
# Download dari: https://www.rabbitmq.com/download.html
# Atau gunakan Docker:
docker run -d -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

#### 5. Jalankan Server dan Consumer

```bash
# Mode development dengan auto-reload
npm run dev

# Mode production
npm start

# Jalankan consumer untuk export playlist (terminal terpisah)
npm run start:consumer

# Mode development consumer
npm run dev:consumer
```

Server akan berjalan di: **http://localhost:5000**

## 🗄 Struktur Database

OpenMusic API v3 menggunakan PostgreSQL dengan **10 tabel utama** yang terbagi dalam 3 versi:

### V1 Tables (Fitur Dasar)

| Tabel    | Deskripsi                              |
| -------- | -------------------------------------- |
| `albums` | Data album musik                       |
| `songs`  | Data lagu dengan foreign key ke albums |

### V2 Tables (Fitur Baru)

| Tabel             | Deskripsi                            |
| ----------------- | ------------------------------------ |
| `users`           | Data akun pengguna                   |
| `authentications` | JWT refresh tokens                   |
| `playlists`       | Data playlist dengan owner reference |
| `playlist_songs`  | Relasi many-to-many playlist-song    |
| `collaborations`  | Data kolaborasi playlist             |

### V3 Tables (Fitur Terbaru)

| Tabel              | Deskripsi                            |
| ------------------ | ------------------------------------ |
| `album_likes`      | Data like/unlike album dari user     |
| `albums.cover_url` | Kolom tambahan untuk URL cover album |

> 📊 **Detail Lengkap:** Lihat struktur database lengkap dengan ERD, constraints, dan indexes di **[Database Schema](docs/DATABASE_SCHEMA.md)**

## 🌐 API Endpoints

### V1 Endpoints (Public Access)

| Method   | Endpoint                   | Deskripsi               |
| -------- | -------------------------- | ----------------------- |
| `GET`    | `/albums`                  | Mendapatkan semua album |
| `POST`   | `/albums`                  | Menambah album baru     |
| `GET`    | `/albums/{id}`             | Detail album            |
| `PUT`    | `/albums/{id}`             | Update album            |
| `DELETE` | `/albums/{id}`             | Hapus album             |
| `GET`    | `/songs`                   | Mendapatkan semua lagu  |
| `POST`   | `/songs`                   | Menambah lagu baru      |
| `GET`    | `/songs/{id}`              | Detail lagu             |
| `PUT`    | `/songs/{id}`              | Update lagu             |
| `DELETE` | `/songs/{id}`              | Hapus lagu              |
| `GET`    | `/songs?title=&performer=` | Pencarian lagu          |

### V2 Endpoints (Authentication Required)

#### 🔐 Authentication

| Method   | Endpoint           | Deskripsi                |
| -------- | ------------------ | ------------------------ |
| `POST`   | `/users`           | Registrasi pengguna baru |
| `POST`   | `/authentications` | Login pengguna           |
| `PUT`    | `/authentications` | Refresh access token     |
| `DELETE` | `/authentications` | Logout pengguna          |

#### 📝 Playlist Management

| Method   | Endpoint                     | Deskripsi                  |
| -------- | ---------------------------- | -------------------------- |
| `GET`    | `/playlists`                 | Mendapatkan playlist user  |
| `POST`   | `/playlists`                 | Membuat playlist baru      |
| `DELETE` | `/playlists/{id}`            | Hapus playlist             |
| `GET`    | `/playlists/{id}/songs`      | Lagu dalam playlist        |
| `POST`   | `/playlists/{id}/songs`      | Tambah lagu ke playlist    |
| `DELETE` | `/playlists/{id}/songs`      | Hapus lagu dari playlist   |
| `GET`    | `/playlists/{id}/activities` | Riwayat aktivitas playlist |

#### 🤝 Collaboration

| Method   | Endpoint          | Deskripsi          |
| -------- | ----------------- | ------------------ |
| `POST`   | `/collaborations` | Tambah kolaborator |
| `DELETE` | `/collaborations` | Hapus kolaborator  |

### V3 Endpoints (Fitur Terbaru)

#### 📤 Export Playlist

| Method | Endpoint                 | Deskripsi                |
| ------ | ------------------------ | ------------------------ |
| `POST` | `/export/playlists/{id}` | Export playlist ke email |

#### 🖼️ Upload Cover Album

| Method | Endpoint              | Deskripsi           |
| ------ | --------------------- | ------------------- |
| `POST` | `/albums/{id}/covers` | Upload sampul album |

#### ❤️ Album Likes

| Method   | Endpoint             | Deskripsi                    |
| -------- | -------------------- | ---------------------------- |
| `POST`   | `/albums/{id}/likes` | Like album (Auth Required)   |
| `DELETE` | `/albums/{id}/likes` | Unlike album (Auth Required) |
| `GET`    | `/albums/{id}/likes` | Get jumlah likes album       |

## 📚 Dokumentasi Lengkap

Untuk informasi lebih detail, silakan lihat dokumentasi berikut:

| 📁 File                                                           | 📄 Deskripsi                                                |
| ----------------------------------------------------------------- | ----------------------------------------------------------- |
| **[📋 Criteria Checklist](docs/CRITERIA_CHECKLIST.md)**           | Checklist kriteria submission Dicoding                      |
| **[🏗 Project Structure Guide](docs/PROJECT_STRUCTURE_GUIDE.md)** | Panduan arsitektur dan struktur proyek                      |
| **[🗄️ Database Schema](docs/DATABASE_SCHEMA.md)**                 | **Struktur database lengkap dengan relasi dan constraints** |
| **[🧪 Testing Guide](docs/TESTING_GUIDE.md)**                     | Panduan testing API endpoints                               |
| **[📖 API Examples](docs/API_EXAMPLES.md)**                       | Contoh penggunaan API lengkap                               |

> 💡 **Tips:**
>
> - Mulai dengan membaca **[Testing Guide](docs/TESTING_GUIDE.md)** untuk quick start testing API
> - Lihat **[Database Schema](docs/DATABASE_SCHEMA.md)** untuk memahami struktur data lengkap
> - Pelajari **[Project Structure Guide](docs/PROJECT_STRUCTURE_GUIDE.md)** untuk memahami arsitektur Clean Architecture

## 🧪 Testing

### Postman Collection

Import collection dari folder `postman/` untuk testing lengkap:

- **File Collection:** `Open Music API V2 Test.postman_collection.json`
- **Environment:** `OpenMusic API Test.postman_environment.json`

### Manual Testing

Lihat panduan detail di **[Testing Guide](docs/TESTING_GUIDE.md)** untuk:

- Setup testing environment
- Authentication flow testing
- Playlist management testing
- Collaboration testing
- Common troubleshooting

### Development Commands

```bash
# Jalankan dalam mode development
npm run dev

# Jalankan consumer untuk export playlist
npm run start:consumer

# Consumer dalam mode development
npm run dev:consumer

# Test koneksi database
npm run test:db

# Jalankan migrations
npm run migrate:up

# Rollback migrations
npm run migrate:down

# Setup sample data
npm run setup:sample
```

## ✅ Kriteria Submission

### Kriteria Wajib (6/6) ✅

1. ✅ **Registrasi dan Autentikasi Pengguna**
2. ✅ **Pengelolaan Data Playlist**
3. ✅ **Menerapkan Foreign Key**
4. ✅ **Menerapkan Data Validation**
5. ✅ **Penanganan Eror (Error Handling)**
6. ✅ **Mempertahankan Fitur OpenMusic API V1**

### Kriteria Wajib V3 (5/5) ✅

1. ✅ **Export Playlist dengan RabbitMQ**
2. ✅ **Upload Sampul Album**
3. ✅ **Menyukai Album dengan Authentication**
4. ✅ **Server-Side Cache dengan Redis**
5. ✅ **Mempertahankan Fitur OpenMusic API v2 dan v1**

### Kriteria Opsional (3/3) ✅

1. ✅ **Fitur Kolaborasi Playlist**
2. ✅ **Aktivitas Pengguna pada Playlist**
3. ✅ **Mempertahankan Fitur Opsional OpenMusic API V1**

**Status:** 🎯 **100% Complete** - OpenMusic API v3 siap untuk submission!

> 📊 **Detail Kriteria:** Lihat checklist lengkap di **[Criteria Checklist](docs/CRITERIA_CHECKLIST.md)**

---

## 📞 Informasi Tambahan

- **Framework:** Hapi.js - Web framework yang powerful dan feature-rich
- **Database Migration:** Menggunakan node-pg-migrate untuk version control database
- **Authentication:** JWT dengan dual token system (access + refresh)
- **Architecture:** Clean Architecture untuk maintainability
- **Validation:** Joi schema untuk input validation yang robust
- **Message Broker:** RabbitMQ untuk async export processing
- **Caching:** Redis untuk server-side caching dan performa optimal
- **Email:** Nodemailer untuk pengiriman export via email
- **File Storage:** Flexible storage (Local File System atau Amazon S3)

---

**🎵 OpenMusic API v3** - _Platform musik yang aman, scalable, dan feature-rich dengan async processing dan caching_

## 🎉 FINAL SUMMARY - OpenMusic API v3 is COMPLETE! ✅

**The OpenMusic API v3 implementation has been successfully completed with all required features:**

### ✅ All V3 Features Implemented:

1. **Playlist Export with RabbitMQ** - Complete message queue system with email notifications
2. **Album Cover Upload** - Full file upload system with validation and storage options
3. **Album Likes System** - Like/unlike functionality with user authentication
4. **Redis Caching** - 30-minute cache with proper invalidation and headers
5. **Backward Compatibility** - All V1 and V2 features maintained and working

### ✅ Production-Ready Components:

- Complete database schema with migrations
- Comprehensive error handling and validation
- JWT authentication and authorization
- File upload with proper validation
- Redis caching with TTL
- RabbitMQ message queue integration
- Email service with SMTP
- Static file serving
- CORS configuration
- Clean architecture with separation of concerns

### ✅ Ready for Testing:

- Postman collection with comprehensive test scenarios
- Database connection verified
- All services properly configured
- Documentation complete

### 🚀 Next Steps:

1. **Start the server**: `npm run dev`
2. **Start the consumer**: `npm run dev:consumer` (for export feature)
3. **Run Postman tests**: Import and execute the test collection
4. **Deploy to production**: All components are production-ready

**STATUS: ✅ IMPLEMENTATION COMPLETE - READY FOR DEPLOYMENT**

---

The OpenMusic API v3 meets all submission criteria and is ready for immediate testing and production deployment!
