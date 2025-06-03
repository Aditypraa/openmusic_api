# OpenMusic API - Checklist Kriteria

## ✅ Kriteria 1: Konfigurasi Proyek Node.js

- [x] Aplikasi HTTP Server bisa dijalankan dengan `npm run start`
- [x] Script start terdapat dalam package.json
- [x] Menggunakan environment variable HOST dan PORT

## ✅ Kriteria 2: Pengelolaan Data Album

- [x] POST /albums - Menambah album
- [x] GET /albums/{id} - Mendapatkan detail album
- [x] PUT /albums/{id} - Mengubah album
- [x] DELETE /albums/{id} - Menghapus album
- [x] Response body sesuai format yang diminta

## ✅ Kriteria 3: Pengelolaan Data Song

- [x] POST /songs - Menambah lagu
- [x] GET /songs - Mendapatkan daftar lagu
- [x] GET /songs/{id} - Mendapatkan detail lagu
- [x] PUT /songs/{id} - Mengubah lagu
- [x] DELETE /songs/{id} - Menghapus lagu
- [x] Response body sesuai format yang diminta
- [x] Struktur objek song sesuai spesifikasi

## ✅ Kriteria 4: Menerapkan Data Validation

- [x] POST /albums - Validasi name (string, required) dan year (number, required)
- [x] PUT /albums - Validasi name (string, required) dan year (number, required)
- [x] POST /songs - Validasi semua field sesuai spesifikasi
- [x] PUT /songs - Validasi semua field sesuai spesifikasi
- [x] Menggunakan Joi untuk validasi

## ✅ Kriteria 5: Penanganan Error (Error Handling)

- [x] Status 400 (Bad Request) untuk validasi gagal
- [x] Status 404 (Not Found) untuk resource tidak ditemukan
- [x] Status 500 (Internal Server Error) untuk server error
- [x] Response body dengan format yang benar (status: fail/error, message)

## ✅ Kriteria 6: Menggunakan Database PostgreSQL

- [x] Data disimpan dalam database PostgreSQL
- [x] Menggunakan teknik migrations dengan node-pg-migrate
- [x] Menggunakan SQL murni (bukan ORM)
- [x] Environment variables untuk database (PGUSER, PGPASSWORD, dll)
- [x] Menggunakan package dotenv dan file .env

## ✅ Kriteria Opsional 1: Daftar Lagu dalam Detail Album

- [x] Endpoint GET /albums/{id} menampilkan daftar lagu dalam album
- [x] Format response sesuai spesifikasi

## ✅ Kriteria Opsional 2: Query Parameter Pencarian Lagu

- [x] Query parameter ?title untuk mencari berdasarkan judul
- [x] Query parameter ?performer untuk mencari berdasarkan performer
- [x] Dapat dikombinasikan (title + performer)
- [x] Menggunakan ILIKE untuk case-insensitive search

## File Structure

```
├── package.json ✅
├── .env ✅
├── .env.example ✅
├── .gitignore ✅
├── README.md ✅
├── API_EXAMPLES.md ✅
├── migrations/
│   ├── 1685000000000_create-table-albums.js ✅
│   └── 1685000000001_create-table-songs.js ✅
└── src/
    ├── server.js ✅
    ├── exceptions/
    │   ├── ClientError.js ✅
    │   ├── InvariantError.js ✅
    │   └── NotFoundError.js ✅
    ├── handlers/
    │   ├── AlbumsHandler.js ✅
    │   └── SongsHandler.js ✅
    ├── routes/
    │   ├── albums.js ✅
    │   └── songs.js ✅
    ├── services/
    │   ├── AlbumsService.js ✅
    │   └── SongsService.js ✅
    ├── utils/
    │   └── database.js ✅
    └── validator/
        ├── albums/
        │   ├── index.js ✅
        │   └── schema.js ✅
        └── songs/
            ├── index.js ✅
            └── schema.js ✅
```

## Teknologi yang Digunakan

- ✅ Node.js dengan ES Modules
- ✅ Hapi.js sebagai HTTP Server framework
- ✅ PostgreSQL sebagai database
- ✅ Joi untuk data validation
- ✅ node-pg-migrate untuk migrations
- ✅ pg sebagai PostgreSQL client
- ✅ nanoid untuk ID generation
- ✅ dotenv untuk environment variables

Semua kriteria utama dan opsional telah terpenuhi! 🎉
