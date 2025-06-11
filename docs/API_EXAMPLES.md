# 🎵 OpenMusic API v3 - Test Examples

Kumpulan contoh request untuk testing semua endpoint OpenMusic API v3.

> 🌐 **Base URL:** `http://localhost:5000`  
> 📚 **Dokumentasi Lengkap:** [README.md](../README.md)  
> 🧪 **Postman Collection:** [Open Music API V3 Test.postman_collection.json](../postman/Open%20Music%20API%20V3%20Test.postman_collection.json)

## 📋 API Structure Overview

- **V1 Endpoints** - Albums & Songs (Public Access)
- **V2 Endpoints** - Users, Authentication, Playlists, Collaborations (JWT Auth)
- **V3 Endpoints** - Album Cover Upload, Album Likes, Playlist Export (New Features)

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
      "coverUrl": "http://localhost:5000/uploads/1749643884476picture-small.jpg",
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

---

## 👥 Users Endpoints (V2)

### 1. POST /users (Register User)

```bash
curl -X POST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secret123",
    "fullname": "John Doe"
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "message": "User berhasil ditambahkan",
  "data": {
    "userId": "user-Qbax5Oy7L8WKf74l"
  }
}
```

---

## 🔐 Authentication Endpoints (V2)

### 1. POST /authentications (Login)

```bash
curl -X POST http://localhost:5000/authentications \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "secret123"
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Authentication berhasil ditambahkan",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. PUT /authentications (Refresh Access Token)

```bash
curl -X PUT http://localhost:5000/authentications \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Access Token berhasil diperbarui",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. DELETE /authentications (Logout)

```bash
curl -X DELETE http://localhost:5000/authentications \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Refresh token berhasil dihapus"
}
```

---

## 🎵 Playlists Endpoints (V2)

> 🔒 **Authentication Required:** All playlist endpoints require `Authorization: Bearer <access_token>` header

### 1. POST /playlists (Create Playlist)

```bash
curl -X POST http://localhost:5000/playlists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "name": "My Favorite Songs"
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Playlist berhasil ditambahkan",
  "data": {
    "playlistId": "playlist-Qbax5Oy7L8WKf74l"
  }
}
```

### 2. GET /playlists (Get User Playlists)

```bash
curl -X GET http://localhost:5000/playlists \
  -H "Authorization: Bearer <access_token>"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "playlists": [
      {
        "id": "playlist-Qbax5Oy7L8WKf74l",
        "name": "My Favorite Songs",
        "username": "john_doe"
      }
    ]
  }
}
```

### 3. DELETE /playlists/{id} (Delete Playlist)

```bash
curl -X DELETE http://localhost:5000/playlists/playlist-Qbax5Oy7L8WKf74l \
  -H "Authorization: Bearer <access_token>"
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Playlist berhasil dihapus"
}
```

### 4. POST /playlists/{id}/songs (Add Song to Playlist)

```bash
curl -X POST http://localhost:5000/playlists/playlist-Qbax5Oy7L8WKf74l/songs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "songId": "song-RBNXOOWEg2Qbz5Ep"
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Lagu berhasil ditambahkan ke playlist"
}
```

### 5. GET /playlists/{id}/songs (Get Playlist Songs)

```bash
curl -X GET http://localhost:5000/playlists/playlist-Qbax5Oy7L8WKf74l/songs \
  -H "Authorization: Bearer <access_token>"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "playlist": {
      "id": "playlist-Qbax5Oy7L8WKf74l",
      "name": "My Favorite Songs",
      "username": "john_doe",
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

### 6. DELETE /playlists/{id}/songs (Remove Song from Playlist)

```bash
curl -X DELETE http://localhost:5000/playlists/playlist-Qbax5Oy7L8WKf74l/songs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "songId": "song-RBNXOOWEg2Qbz5Ep"
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Lagu berhasil dihapus dari playlist"
}
```

### 7. GET /playlists/{id}/activities (Get Playlist Activities)

```bash
curl -X GET http://localhost:5000/playlists/playlist-Qbax5Oy7L8WKf74l/activities \
  -H "Authorization: Bearer <access_token>"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "activities": [
      {
        "username": "john_doe",
        "title": "Life in Technicolor",
        "action": "add",
        "time": "2024-01-15T14:30:00.000Z"
      }
    ]
  }
}
```

---

## 🤝 Collaborations Endpoints (V2)

> 🔒 **Authentication Required:** Only playlist owners can add/remove collaborators

### 1. POST /collaborations (Add Collaborator)

```bash
curl -X POST http://localhost:5000/collaborations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "playlistId": "playlist-Qbax5Oy7L8WKf74l",
    "userId": "user-Mk8AnmCp210PwT6B"
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Kolaborasi berhasil ditambahkan",
  "data": {
    "collaborationId": "collab-Qbax5Oy7L8WKf74l"
  }
}
```

### 2. DELETE /collaborations (Remove Collaborator)

```bash
curl -X DELETE http://localhost:5000/collaborations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "playlistId": "playlist-Qbax5Oy7L8WKf74l",
    "userId": "user-Mk8AnmCp210PwT6B"
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Kolaborasi berhasil dihapus"
}
```

---

## 🎨 Upload Cover Endpoints (V3) ⭐

### POST /albums/{id}/covers (Upload Album Cover)

```bash
curl -X POST http://localhost:5000/albums/album-Qbax5Oy7L8WKf74l/covers \
  -F "cover=@/path/to/image.jpg"
```

**PowerShell Example:**

```powershell
$form = @{
    cover = Get-Item "C:\path\to\image.jpg"
}
Invoke-RestMethod -Uri "http://localhost:5000/albums/album-Qbax5Oy7L8WKf74l/covers" -Method POST -Form $form
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Sampul berhasil diunggah"
}
```

**Validation Rules:**

- **Supported formats:** JPEG, PNG, GIF, WEBP, AVIF, APNG
- **Max file size:** 512KB
- **Field name:** `cover`

**After upload, GET /albums/{id} will include:**

```json
{
  "status": "success",
  "data": {
    "album": {
      "id": "album-Qbax5Oy7L8WKf74l",
      "name": "Viva la Vida",
      "year": 2008,
      "coverUrl": "http://localhost:5000/uploads/1749643884476picture-small.jpg",
      "songs": [...]
    }
  }
}
```

---

## ❤️ Album Likes Endpoints (V3) ⭐

### 1. POST /albums/{id}/likes (Like Album)

> 🔒 **Authentication Required**

```bash
curl -X POST http://localhost:5000/albums/album-Qbax5Oy7L8WKf74l/likes \
  -H "Authorization: Bearer <access_token>"
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Berhasil menyukai album"
}
```

### 2. DELETE /albums/{id}/likes (Unlike Album)

> 🔒 **Authentication Required**

```bash
curl -X DELETE http://localhost:5000/albums/album-Qbax5Oy7L8WKf74l/likes \
  -H "Authorization: Bearer <access_token>"
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Berhasil batal menyukai album"
}
```

### 3. GET /albums/{id}/likes (Get Album Likes Count)

> 🌐 **Public Access** - No authentication required

```bash
curl -X GET http://localhost:5000/albums/album-Qbax5Oy7L8WKf74l/likes
```

**Response (200) - From Database:**

```json
{
  "status": "success",
  "data": {
    "likes": 5
  }
}
```

**Response (200) - From Cache:**

```json
{
  "status": "success",
  "data": {
    "likes": 5
  }
}
```

**Headers:** `X-Data-Source: cache` (when served from Redis cache)

> ⚡ **Caching:** Likes count cached for 30 minutes, invalidated on like/unlike

---

## 📤 Export Playlist Endpoints (V3) ⭐

### POST /export/playlists/{id} (Export Playlist to Email)

> 🔒 **Authentication Required** - Only playlist owner can export

```bash
curl -X POST http://localhost:5000/export/playlists/playlist-Qbax5Oy7L8WKf74l \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "targetEmail": "user@example.com"
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "message": "Permintaan Anda sedang kami proses"
}
```

**Email Content (JSON):**

```json
{
  "playlist": {
    "id": "playlist-Qbax5Oy7L8WKf74l",
    "name": "My Favorite Songs",
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

> 🐰 **Background Processing:** Uses RabbitMQ for async processing and email delivery

---

## 💻 PowerShell Examples (Windows)

### Authentication Flow

````powershell
# Register user
$registerBody = @{
  username = "john_doe"
  password = "secret123"
  fullname = "John Doe"
} | ConvertTo-Json

$user = Invoke-RestMethod -Uri "http://localhost:5000/users" -Method POST -Body $registerBody -ContentType "application/json"

# Login
$loginBody = @{
  username = "john_doe"
  password = "secret123"
} | ConvertTo-Json

$auth = Invoke-RestMethod -Uri "http://localhost:5000/authentications" -Method POST -Body $loginBody -ContentType "application/json"
$accessToken = $auth.data.accessToken

# Create playlist
$playlistBody = @{
  name = "My Favorite Songs"
} | ConvertTo-Json

$headers = @{
  "Authorization" = "Bearer $accessToken"
  "Content-Type" = "application/json"
}

$playlist = Invoke-RestMethod -Uri "http://localhost:5000/playlists" -Method POST -Body $playlistBody -Headers $headers

# Add song to playlist
$songBody = @{
  songId = "song-RBNXOOWEg2Qbz5Ep"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/playlists/$($playlist.data.playlistId)/songs" -Method POST -Body $songBody -Headers $headers

# Like album
Invoke-RestMethod -Uri "http://localhost:5000/albums/album-Qbax5Oy7L8WKf74l/likes" -Method POST -Headers $headers

# Get likes count
Invoke-RestMethod -Uri "http://localhost:5000/albums/album-Qbax5Oy7L8WKf74l/likes" -Method GET
```

---

## 🔧 Testing dengan Sample Data

Untuk testing yang lebih mudah, jalankan script setup sample data:

```powershell
npm run setup:sample
````

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

**🎵 API Examples** - _Complete testing guide untuk semua endpoint OpenMusic API v3_

> 📋 **Testing Tips:**
>
> - Use Postman collection untuk testing yang lebih mudah
> - V1 endpoints: Public access (Albums, Songs)
> - V2 endpoints: JWT authentication required (Users, Playlists, etc.)
> - V3 endpoints: New features (Upload, Likes, Export)
> - Redis caching untuk album likes dengan TTL 30 menit
> - Background processing untuk export menggunakan RabbitMQ
