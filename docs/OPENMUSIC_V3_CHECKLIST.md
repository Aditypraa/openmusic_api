# OpenMusic API v3 - Checklist Kriteria

## ✅ Kriteria 1: Export Playlist dengan RabbitMQ

- [x] Endpoint POST /export/playlists/{playlistId}
- [x] Request body berisi targetEmail
- [x] Menggunakan RabbitMQ sebagai message broker
- [x] Environment variable RABBITMQ_SERVER
- [x] Hanya pemilik playlist yang boleh export
- [x] Data yang dikirimkan hanya playlistId
- [x] Consumer program terpisah
- [x] Export berupa data JSON
- [x] Dikirimkan via email menggunakan nodemailer
- [x] Environment variables: SMTP_USER, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT
- [x] Response 201 dengan message "Permintaan Anda sedang kami proses"

## ✅ Kriteria 2: Upload Sampul Album

- [x] Endpoint POST /albums/{id}/covers
- [x] Body request multipart/form-data dengan field "cover"
- [x] Validasi MIME types image
- [x] Maksimal file size 512000 Bytes
- [x] Support Local File System dan S3 Bucket
- [x] Environment variables untuk S3: AWS_BUCKET_NAME, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
- [x] Response 201 dengan message "Sampul berhasil diunggah"
- [x] GET /albums/{id} menampilkan properti coverUrl
- [x] URL gambar dapat diakses
- [x] coverUrl bernilai null jika belum ada sampul
- [x] Sampul lama tergantikan jika upload sampul baru

## ✅ Kriteria 3: Menyukai Album

- [x] POST /albums/{id}/likes - Menyukai album (Auth required)
- [x] DELETE /albums/{id}/likes - Batal menyukai album (Auth required)
- [x] GET /albums/{id}/likes - Melihat jumlah yang menyukai album
- [x] Authentication required untuk menyukai/batal menyukai
- [x] Pengguna hanya bisa menyukai album yang sama 1 kali
- [x] Response 400 jika mencoba menyukai album yang sudah disukai

## ✅ Kriteria 4: Server-Side Cache

- [x] Cache pada GET /albums/{id}/likes
- [x] Cache bertahan 30 menit
- [x] Custom header X-Data-Source: "cache" dari cache
- [x] Cache dihapus saat ada perubahan likes
- [x] Menggunakan Redis sebagai memory caching engine
- [x] Environment variable REDIS_SERVER

## ✅ Kriteria 5: Mempertahankan Fitur v2 dan v1

- [x] Pengelolaan Data Album
- [x] Pengelolaan Data Song
- [x] Registrasi dan Autentikasi Pengguna
- [x] Pengelolaan Data Playlist
- [x] Foreign Key relationships
- [x] Data Validation dengan Joi
- [x] Error Handling

## 🏗️ Teknologi yang Digunakan

- ✅ Node.js dengan ES Modules
- ✅ Hapi.js sebagai HTTP Server framework
- ✅ PostgreSQL sebagai database
- ✅ Redis untuk caching
- ✅ RabbitMQ untuk message broker
- ✅ Nodemailer untuk email
- ✅ AWS SDK untuk S3 (optional)
- ✅ Joi untuk data validation
- ✅ node-pg-migrate untuk migrations
- ✅ JWT untuk authentication
- ✅ bcrypt untuk password hashing

## 📁 Struktur File v3

```
├── package.json ✅ (updated dengan dependencies baru)
├── .env.example ✅ (updated dengan env vars v3)
├── README.md ✅ (updated untuk v3)
├── migrations/
│   ├── 1749097100000_add-cover-url-to-albums.js ✅
│   └── 1749097200000_create-table-album-likes.js ✅
├── src/
│   ├── server.js ✅ (updated untuk v3)
│   ├── consumer/
│   │   ├── index.js ✅
│   │   ├── MailSender.js ✅
│   │   └── PlaylistsService.js ✅
│   ├── handlers/
│   │   ├── UploadsHandler.js ✅
│   │   ├── ExportsHandler.js ✅
│   │   └── AlbumLikesHandler.js ✅
│   ├── routes/
│   │   ├── uploads.js ✅
│   │   └── exports.js ✅
│   ├── services/
│   │   ├── ExportsService.js ✅
│   │   └── AlbumLikesService.js ✅
│   ├── utils/
│   │   ├── CacheService.js ✅
│   │   ├── StorageService.js ✅
│   │   ├── ProducerService.js ✅
│   │   ├── rabbitmq/
│   │   │   └── ProducerService.js ✅
│   │   └── S3/
│   │       └── S3StorageService.js ✅
│   └── validator/
│       ├── uploads/
│       │   ├── index.js ✅
│       │   └── schema.js ✅
│       └── exports/
│           ├── index.js ✅
│           └── schema.js ✅
└── uploads/ ✅ (folder untuk local storage)
```

## 🚀 Scripts yang Tersedia

- `npm start` - Jalankan server production
- `npm run dev` - Jalankan server development
- `npm run start:consumer` - Jalankan consumer production
- `npm run dev:consumer` - Jalankan consumer development
- `npm run migrate:up` - Jalankan migrations
- `npm run migrate:down` - Rollback migrations
- `npm run test:db` - Test koneksi database
- `npm run setup:sample` - Setup sample data

Semua kriteria OpenMusic API v3 telah terpenuhi! 🎉
