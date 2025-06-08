# 🎵 OpenMusic API v2

RESTful API untuk platform musik dengan fitur manajemen playlist, kolaborasi pengguna, dan sistem autentikasi yang aman.

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

### V2 (Fitur Baru)

- 🔐 **Sistem Autentikasi** - JWT dengan access & refresh token
- 👤 **Registrasi Pengguna** - Manajemen akun user
- 📝 **Manajemen Playlist** - CRUD playlist pribadi
- 🤝 **Kolaborasi Playlist** - Berbagi dan kolaborasi playlist
- 📊 **Activity Tracking** - Riwayat aktivitas playlist

## 🛠 Teknologi

| Kategori           | Teknologi                         |
| ------------------ | --------------------------------- |
| **Backend**        | Node.js + Hapi.js Framework       |
| **Database**       | PostgreSQL dengan node-pg-migrate |
| **Authentication** | JSON Web Token (JWT)              |
| **Validation**     | Joi Schema Validator              |
| **Architecture**   | Clean Architecture Pattern        |

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

#### 4. Jalankan Server

```bash
# Mode development dengan auto-reload
npm run dev

# Mode production
npm start
```

Server akan berjalan di: **http://localhost:5000**

## 🗄 Struktur Database

OpenMusic API v2 menggunakan PostgreSQL dengan **8 tabel utama** yang terbagi dalam 2 versi:

### V1 Tables (Fitur Dasar)

| Tabel    | Deskripsi                              |
| -------- | -------------------------------------- |
| `albums` | Data album musik                       |
| `songs`  | Data lagu dengan foreign key ke albums |

### V2 Tables (Fitur Baru)

| Tabel                      | Deskripsi                            |
| -------------------------- | ------------------------------------ |
| `users`                    | Data akun pengguna                   |
| `authentications`          | JWT refresh tokens                   |
| `playlists`                | Data playlist dengan owner reference |
| `playlist_songs`           | Relasi many-to-many playlist-song    |
| `collaborations`           | Data kolaborasi playlist             |
| `playlist_song_activities` | Riwayat aktivitas playlist           |

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

### Kriteria Opsional (3/3) ✅

1. ✅ **Fitur Kolaborasi Playlist**
2. ✅ **Aktivitas Pengguna pada Playlist**
3. ✅ **Mempertahankan Fitur Opsional OpenMusic API V1**

**Status:** 🎯 **100% Complete** - Siap untuk submission!

> 📊 **Detail Kriteria:** Lihat checklist lengkap di **[Criteria Checklist](docs/CRITERIA_CHECKLIST.md)**

---

## 📞 Informasi Tambahan

- **Framework:** Hapi.js - Web framework yang powerful dan feature-rich
- **Database Migration:** Menggunakan node-pg-migrate untuk version control database
- **Authentication:** JWT dengan dual token system (access + refresh)
- **Architecture:** Clean Architecture untuk maintainability
- **Validation:** Joi schema untuk input validation yang robust

---

**🎵 OpenMusic API v2** - _Platform musik yang aman dan scalable untuk manajemen playlist collaborative_

```

```
