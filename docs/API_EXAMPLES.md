# 🎵 OpenMusic API v2 - Test Examples

Kumpulan contoh request untuk testing semua endpoint OpenMusic API v2.

> 🌐 **Base URL:** `http://localhost:5000`  
> 📚 **Dokumentasi Lengkap:** [README.md](../README.md)

## 📀 Albums Endpoints

### 1. POST /albums (Tambah Album)

```bash
curl -X POST http://localhost:5000/albums \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Viva la Vida",
    "year": 2008
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Album berhasil ditambahkan",
  "data": {
    "albumId": "album-Qbax5Oy7L8WKf74l"
  }
}
```

### 2. GET /albums/{id} (Dapatkan Album + Songs)

```bash
curl http://localhost:5000/albums/album-Qbax5Oy7L8WKf74l
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-Qbax5Oy7L8WKf74l",
      "name": "Viva la Vida",
      "year": 2008,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "songs": [
        {
          "id": "song-RBNXOOWEg2Qbz5Ep",
          "title": "Life in Technicolor",
          "performer": "Coldplay"
        }
      ]
    }
  }
}
```

### 3. PUT /albums/{id} (Update Album)

```bash
curl -X PUT http://localhost:5000/albums/album-Qbax5Oy7L8WKf74l \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Viva la Vida (Deluxe Edition)",
    "year": 2008
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Album berhasil diperbarui"
}
```

### 4. DELETE /albums/{id} (Hapus Album)

```bash
curl -X DELETE http://localhost:5000/albums/album-Qbax5Oy7L8WKf74l
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Album berhasil dihapus"
}
```

## 🎶 Songs Endpoints

### 1. POST /songs (Tambah Lagu)

```bash
curl -X POST http://localhost:5000/songs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Life in Technicolor",
    "year": 2008,
    "genre": "Alternative Rock",
    "performer": "Coldplay",
    "duration": 120,
    "albumId": "album-Qbax5Oy7L8WKf74l"
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Lagu berhasil ditambahkan",
  "data": {
    "songId": "song-RBNXOOWEg2Qbz5Ep"
  }
}
```

### 2. GET /songs (Dapatkan Semua Lagu)

```bash
curl http://localhost:5000/songs
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "songs": [
      {
        "id": "song-RBNXOOWEg2Qbz5Ep",
        "title": "Life in Technicolor",
        "performer": "Coldplay"
      }
    ]
  }
}
```

### 3. GET /songs dengan Query Parameter

```bash
# Cari berdasarkan title
curl "http://localhost:5000/songs?title=Life"

# Cari berdasarkan performer
curl "http://localhost:5000/songs?performer=Coldplay"

# Kombinasi pencarian
curl "http://localhost:5000/songs?title=Life&performer=Coldplay"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "songs": [
      {
        "id": "song-RBNXOOWEg2Qbz5Ep",
        "title": "Life in Technicolor",
        "performer": "Coldplay"
      }
    ]
  }
}
```

### 4. GET /songs/{id} (Dapatkan Detail Lagu)

```bash
curl http://localhost:5000/songs/song-RBNXOOWEg2Qbz5Ep
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "song": {
      "id": "song-RBNXOOWEg2Qbz5Ep",
      "title": "Life in Technicolor",
      "year": 2008,
      "genre": "Alternative Rock",
      "performer": "Coldplay",
      "duration": 120,
      "albumId": "album-Qbax5Oy7L8WKf74l"
    }
  }
}
```

### 5. PUT /songs/{id} (Update Lagu)

```bash
curl -X PUT http://localhost:5000/songs/song-RBNXOOWEg2Qbz5Ep \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Life in Technicolor (Remastered)",
    "year": 2008,
    "genre": "Alternative Rock",
    "performer": "Coldplay",
    "duration": 125,
    "albumId": "album-Qbax5Oy7L8WKf74l"
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Lagu berhasil diperbarui"
}
```

### 6. DELETE /songs/{id} (Hapus Lagu)

```bash
curl -X DELETE http://localhost:5000/songs/song-RBNXOOWEg2Qbz5Ep
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Lagu berhasil dihapus"
}
```

## 💻 PowerShell Examples (Windows)

Untuk Windows PowerShell, gunakan `Invoke-RestMethod`:

### POST Album

```powershell
$body = @{
  name = "Viva la Vida"
  year = 2008
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/albums" -Method POST -Body $body -ContentType "application/json"
```

### POST Song

```powershell
$body = @{
  title = "Life in Technicolor"
  year = 2008
  genre = "Alternative Rock"
  performer = "Coldplay"
  duration = 120
  albumId = "album-Qbax5Oy7L8WKf74l"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/songs" -Method POST -Body $body -ContentType "application/json"
```

### GET Requests

```powershell
# Get album with songs
Invoke-RestMethod -Uri "http://localhost:5000/albums/album-Qbax5Oy7L8WKf74l" -Method GET

# Get all songs
Invoke-RestMethod -Uri "http://localhost:5000/songs" -Method GET

# Search songs
Invoke-RestMethod -Uri "http://localhost:5000/songs?title=Life&performer=Coldplay" -Method GET

# Get specific song
Invoke-RestMethod -Uri "http://localhost:5000/songs/song-RBNXOOWEg2Qbz5Ep" -Method GET
```

## 🔧 Testing dengan Sample Data

Untuk testing yang lebih mudah, jalankan script setup sample data:

```bash
npm run setup:sample
```

Script ini akan membuat:

- 1 album sampel: "Viva la Vida" (2008)
- 3 lagu sampel dari album tersebut

Setelah itu Anda bisa langsung testing endpoint dengan data yang sudah ada.

## ⚠️ Error Responses

### 400 - Bad Request (Validation Error)

```json
{
  "status": "fail",
  "message": "\"name\" is required"
}
```

### 404 - Not Found

```json
{
  "status": "fail",
  "message": "Album tidak ditemukan"
}
```

### 500 - Internal Server Error

```json
{
  "status": "error",
  "message": "Maaf, terjadi kegagalan pada server kami."
}
```

---

**🎵 API Examples** - _Testing guide untuk semua endpoint OpenMusic API v2_
