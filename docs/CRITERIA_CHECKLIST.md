# OpenMusic API v3 - Submission Criteria Checklist

## 🎯 OpenMusic API v3 - Kriteria Utama

Berdasarkan studi kasus yang diberikan, OpenMusic API v3 harus memenuhi **5 kriteria utama**:

### ✅ Kriteria 1: Ekspor Lagu Pada Playlist

**Endpoint:** `POST /export/playlists/{playlistId}`
**Request Body:**

```json
{
  "targetEmail": "user@example.com"
}
```

**Ketentuan yang Dipenuhi:**

- [x] Wajib menggunakan **RabbitMQ** sebagai message broker
- [x] Environment variable `RABBITMQ_SERVER` untuk host server
- [x] Hanya **pemilik playlist** yang boleh mengekspor lagu
- [x] Data yang dikirim: `playlistId` dan `targetEmail` saja
- [x] Program **consumer terpisah** (`src/consumer/index.js`)
- [x] Hasil ekspor berupa **data JSON**
- [x] Dikirim melalui **email** menggunakan nodemailer
- [x] Environment variables: `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_HOST`, `SMTP_PORT`

**Response:**

```json
{
  "status": "success",
  "message": "Permintaan Anda sedang kami proses"
}
```

**Format JSON Export:**

```json
{
  "playlist": {
    "id": "playlist-Mk8AnmCp210PwT6B",
    "name": "My Favorite Coldplay Song",
    "songs": [
      {
        "id": "song-Qbax5Oy7L8WKf74l",
        "title": "Life in Technicolor",
        "performer": "Coldplay"
      }
    ]
  }
}
```

### ✅ Kriteria 2: Mengunggah Sampul Album

**Endpoint:** `POST /albums/{id}/covers`
**Request Body (Form Data):**

```
cover: file
```

**Ketentuan yang Dipenuhi:**

- [x] MIME types harus **images** (JPEG, PNG, GIF, WEBP, AVIF, APNG)
- [x] Ukuran file maksimal **512000 Bytes** (512KB)
- [x] Support **File System lokal** dan **S3 Bucket**
- [x] Environment variables S3: `AWS_BUCKET_NAME`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- [x] **Flexible storage switching** via `STORAGE_TYPE=local|s3`

**Response:**

```json
{
  "status": "success",
  "message": "Sampul berhasil diunggah"
}
```

**GET /albums/{id} Response:**

```json
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-Mk8AnmCp210PwT6B",
      "name": "Viva la Vida",
      "coverUrl": "http://localhost:5000/uploads/1234567890cover.jpg"
    }
  }
}
```

**Ketentuan Cover:**

- [x] URL gambar dapat **diakses dengan baik**
- [x] `coverUrl` bernilai **null** jika belum ada sampul
- [x] Sampul baru **mengganti** sampul lama

### ✅ Kriteria 3: Menyukai Album

**Endpoints:**

- `POST /albums/{id}/likes` - Menyukai album (Auth required)
- `DELETE /albums/{id}/likes` - Batal menyukai album (Auth required)
- `GET /albums/{id}/likes` - Melihat jumlah yang menyukai album

**Ketentuan yang Dipenuhi:**

- [x] **Authentication required** untuk menyukai/batal menyukai
- [x] Pengguna hanya bisa menyukai album yang sama **1 kali**
- [x] Response **400** jika mencoba menyukai album yang sudah disukai
- [x] Sistem **like/unlike** yang aman dan konsisten

### ✅ Kriteria 4: Menerapkan Server-Side Cache

**Target Endpoint:** `GET /albums/{id}/likes`

**Ketentuan yang Dipenuhi:**

- [x] Cache bertahan selama **30 menit** (1800 seconds)
- [x] Custom header `X-Data-Source: "cache"` ketika data dari cache
- [x] Cache **dihapus** setiap kali ada perubahan likes pada album
- [x] Memory caching menggunakan **Redis**
- [x] Environment variable `REDIS_SERVER` untuk host

**Response dari Cache:**

```json
{
  "status": "success",
  "data": {
    "likes": 5
  }
}
```

_Header: `X-Data-Source: cache`_

### ✅ Kriteria 5: Pertahankan Fitur v2 dan v1

**Fitur yang Dipertahankan:**

- [x] **Pengelolaan Data Album** - CRUD operations lengkap
- [x] **Pengelolaan Data Song** - CRUD + search functionality
- [x] **Registrasi dan Autentikasi** - JWT-based auth system
- [x] **Pengelolaan Data Playlist** - Full playlist management
- [x] **Foreign Key Relationships** - Data integrity terjaga
- [x] **Data Validation** - Joi schema validation
- [x] **Error Handling** - Comprehensive error responses
