# OpenMusic API Test Examples

Berikut adalah contoh request untuk testing API OpenMusic:

## Albums

### 1. POST /albums (Tambah Album)

```bash
curl -X POST http://localhost:3000/albums \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Viva la Vida",
    "year": 2008
  }'
```

### 2. GET /albums/{id} (Dapatkan Album + Songs)

```bash
curl http://localhost:3000/albums/{album-id}
```

### 3. PUT /albums/{id} (Update Album)

```bash
curl -X PUT http://localhost:3000/albums/{album-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Viva la Vida (Updated)",
    "year": 2008
  }'
```

### 4. DELETE /albums/{id} (Hapus Album)

```bash
curl -X DELETE http://localhost:3000/albums/{album-id}
```

## Songs

### 1. POST /songs (Tambah Lagu)

```bash
curl -X POST http://localhost:3000/songs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Life in Technicolor",
    "year": 2008,
    "genre": "Indie",
    "performer": "Coldplay",
    "duration": 120,
    "albumId": "{album-id}"
  }'
```

### 2. GET /songs (Dapatkan Semua Lagu)

```bash
curl http://localhost:3000/songs
```

### 3. GET /songs dengan query parameter

```bash
# Cari berdasarkan title
curl "http://localhost:3000/songs?title=Life"

# Cari berdasarkan performer
curl "http://localhost:3000/songs?performer=Coldplay"

# Kombinasi
curl "http://localhost:3000/songs?title=Life&performer=Coldplay"
```

### 4. GET /songs/{id} (Dapatkan Lagu)

```bash
curl http://localhost:3000/songs/{song-id}
```

### 5. PUT /songs/{id} (Update Lagu)

```bash
curl -X PUT http://localhost:3000/songs/{song-id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Life in Technicolor (Updated)",
    "year": 2008,
    "genre": "Alternative Rock",
    "performer": "Coldplay",
    "duration": 125,
    "albumId": "{album-id}"
  }'
```

### 6. DELETE /songs/{id} (Hapus Lagu)

```bash
curl -X DELETE http://localhost:3000/songs/{song-id}
```

## PowerShell Examples (Windows)

Untuk Windows PowerShell, gunakan `Invoke-RestMethod`:

### POST Album

```powershell
$body = @{
  name = "Viva la Vida"
  year = 2008
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/albums" -Method POST -Body $body -ContentType "application/json"
```

### GET Albums

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/albums/{album-id}" -Method GET
```
