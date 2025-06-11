# Testing Guide - OpenMusic API v3

## Prerequisites Setup

Sebelum testing, pastikan semua services berjalan:

### 1. Services Required

- ✅ **PostgreSQL** - Database
- ✅ **Redis** - Caching
- ✅ **RabbitMQ** - Message broker
- ✅ **SMTP Email** - Export notifications

### 2. Environment Setup

```bash
npm install
cp .env.example .env
# Configure all environment variables in .env
```

**Required Environment Variables:**

```env
# Database
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=openmusic_api

# Redis (Required untuk caching)
REDIS_SERVER=127.0.0.1

# RabbitMQ (Required untuk export)
RABBITMQ_SERVER=amqp://localhost

# SMTP (Required untuk export)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Storage (Local/S3)
STORAGE_TYPE=local
# AWS credentials (jika menggunakan S3)
```

### 3. Database Setup

```bash
npm run migrate:up
npm run setup:sample  # Optional sample data
```

### 4. Start Services

```bash
# Terminal 1: API Server
npm run dev

# Terminal 2: Consumer (untuk export)
npm run dev:consumer

# Verify services
redis-cli ping        # Should return PONG
rabbitmqctl status    # Should show running
npm run test:db       # Should connect successfully
```

## Testing Flow

### 1. V1 Endpoints Testing (Public Access)

**Albums Management:**

- Create album: `POST /albums`
- Get album details: `GET /albums/{id}`
- Update album: `PUT /albums/{id}`
- Delete album: `DELETE /albums/{id}`

**Songs Management:**

- Create song: `POST /songs`
- Get all songs: `GET /songs`
- Get song details: `GET /songs/{id}`
- Update song: `PUT /songs/{id}`
- Delete song: `DELETE /songs/{id}`
- Search songs: `GET /songs?title=&performer=`

### 2. V2 Authentication Testing

**User Management:**

- Register new user: `POST /users`
- Login user: `POST /authentications`
- Refresh token: `PUT /authentications`
- Logout: `DELETE /authentications`

### 3. V2 Playlist Management

**Basic Playlist Operations:**

- Create playlist: `POST /playlists`
- Get user playlists: `GET /playlists`
- Get playlist songs: `GET /playlists/{id}/songs`
- Add songs to playlist: `POST /playlists/{id}/songs`
- Delete songs from playlist: `DELETE /playlists/{id}/songs`
- Delete playlist: `DELETE /playlists/{id}`

**Collaboration Testing:**

- Add collaborator: `POST /collaborations`
- Remove collaborator: `DELETE /collaborations`
- Test collaborative access to playlists

**Activities Testing:**

- Get playlist activities: `GET /playlists/{id}/activities`

### 4. V3 Features Testing ⭐

#### A. Upload Album Cover

**Test Scenarios:**

```bash
# Upload valid image
POST /albums/{id}/covers
Content-Type: multipart/form-data
Body: cover=image_file.jpg

# Expected: 201 success
# Verify: GET /albums/{id} shows coverUrl

# Test validation:
# - Invalid MIME type → 400 error
# - File too large (>512KB) → 413 error
# - Missing file → 400 error
```

**Storage Testing:**

```bash
# Test Local Storage
STORAGE_TYPE=local
# Verify files saved in uploads/ folder

# Test S3 Storage
STORAGE_TYPE=s3
# Verify files uploaded to S3 bucket
```

#### B. Album Likes System

**Authentication Required Endpoints:**

```bash
# Like an album
POST /albums/{id}/likes
Authorization: Bearer {access_token}
# Expected: 201 success

# Unlike an album
DELETE /albums/{id}/likes
Authorization: Bearer {access_token}
# Expected: 200 success

# Get likes count (Public access)
GET /albums/{id}/likes
# Expected: 200 with likes count
# Check X-Data-Source header for cache status
```

**Test Scenarios:**

- ✅ Like album → verify count increases
- ✅ Unlike album → verify count decreases
- ✅ Double like → should return 400 error
- ✅ Unauthenticated like → should return 401 error
- ✅ Cache behavior → first request hits DB, second from cache

#### C. Server-Side Caching

**Cache Testing:**

```bash
# First request (from database)
GET /albums/{id}/likes
# Response headers: X-Data-Source: database

# Second request (from cache)
GET /albums/{id}/likes
# Response headers: X-Data-Source: cache

# Wait 30+ minutes or clear cache
# Next request should hit database again
```

**Cache Invalidation Testing:**

```bash
# Get likes (cached)
GET /albums/{id}/likes

# Change likes count
POST /albums/{id}/likes

# Get likes again (should be fresh from DB)
GET /albums/{id}/likes
# Should NOT have X-Data-Source: cache
```

#### D. Export Playlist

**Prerequisites:**

- RabbitMQ running
- Consumer running (`npm run dev:consumer`)
- Valid SMTP configuration

**Test Scenarios:**

```bash
# Export playlist (Owner only)
POST /export/playlists/{playlistId}
Authorization: Bearer {owner_access_token}
Body: { "targetEmail": "test@example.com" }

# Expected: 201 "Permintaan Anda sedang kami proses"
# Check email for JSON attachment

# Test authorization:
# Non-owner access → 403 Forbidden
# Invalid playlist → 404 Not Found
# Invalid email → 400 Bad Request
```

**Export Format Verification:**

```json
{
  "playlist": {
    "id": "playlist-xxx",
    "name": "Playlist Name",
    "songs": [
      {
        "id": "song-xxx",
        "title": "Song Title",
        "performer": "Artist Name"
      }
    ]
  }
}
```

## Development Commands

```bash
# Server Commands
npm run dev              # Development server with auto-reload
npm start                # Production server
npm run dev:consumer     # Development consumer for export
npm run start:consumer   # Production consumer for export

# Database Commands
npm run migrate:up       # Run database migrations
npm run migrate:down     # Rollback migrations
npm run test:db          # Test database connection
npm run setup:sample     # Setup sample data for testing

# Testing Commands
redis-cli ping           # Test Redis connection
rabbitmqctl status       # Check RabbitMQ status
node test-storage.js     # Test storage configuration

# Code Quality
npm run lint             # ESLint check
npm run prettier         # Prettier check
npm run format           # Auto-format code
```

## Expected Results

### V1 & V2 Features

- ✅ All endpoints return proper HTTP status codes
- ✅ JWT authentication works across all protected routes
- ✅ Database constraints prevent invalid data
- ✅ Collaboration features maintain proper access control
- ✅ Search functionality works correctly

### V3 New Features

- ✅ **Caching system** works with proper `X-Data-Source` headers
- ✅ **File upload** saves files and generates accessible URLs
- ✅ **Export playlist** sends emails with correct JSON format
- ✅ **Album likes** system prevents duplicate likes
- ✅ **Storage switching** works between Local and S3

## Common Issues & Solutions

### Database Issues

| Problem            | Solution                                     |
| ------------------ | -------------------------------------------- |
| Connection refused | Verify PostgreSQL is running and .env config |
| Migration failed   | Check database permissions and connection    |
| Foreign key errors | Ensure related records exist before creating |

### Authentication Issues

| Problem               | Solution                                  |
| --------------------- | ----------------------------------------- |
| Token expired         | Use refresh token to get new access token |
| Invalid signature     | Check ACCESS_TOKEN_KEY in .env            |
| Missing authorization | Include Bearer token in header            |

### V3 Specific Issues

| Problem                 | Solution                                             |
| ----------------------- | ---------------------------------------------------- |
| Redis connection failed | `redis-cli ping` should return PONG                  |
| RabbitMQ not working    | Check `rabbitmqctl status` and RABBITMQ_SERVER       |
| Email not sent          | Verify SMTP credentials (use App Password for Gmail) |
| File upload fails       | Check file size (<512KB) and MIME type               |
| Cache not working       | Verify Redis connection and 30-minute TTL            |
| S3 upload fails         | Check AWS credentials and bucket permissions         |

### Service Status Verification

```bash
# Check all services are running
npm run test:db          # ✅ Database: Connected
redis-cli ping           # ✅ Redis: PONG
rabbitmqctl status       # ✅ RabbitMQ: Running
curl localhost:5000      # ✅ API: Server running

# Check environment
node test-storage.js     # ✅ Storage: Configuration OK
```

## Postman Collection

For comprehensive testing, import the Postman collection:

**Files:**

- `postman/Open Music API V3 Test.postman_collection.json`
- `postman/OpenMusic API Test.postman_environment.json`

**Collection includes:**

- ✅ V1 Endpoints (Albums, Songs)
- ✅ V2 Endpoints (Auth, Playlists, Collaborations)
- ✅ V3 Endpoints (Upload, Likes, Export)
- ✅ Environment variables setup
- ✅ Pre-request scripts for authentication
- ✅ Response validation tests

## Testing Checklist

### Pre-Testing Setup ☑️

- [ ] PostgreSQL running and connected
- [ ] Redis server running (`redis-cli ping` returns PONG)
- [ ] RabbitMQ server running (`rabbitmqctl status` OK)
- [ ] Environment variables configured
- [ ] Database migrations executed
- [ ] API server running (`npm run dev`)
- [ ] Consumer running (`npm run dev:consumer`)

### V1 Testing ☑️

- [ ] Create, read, update, delete albums
- [ ] Create, read, update, delete songs
- [ ] Search songs by title and performer
- [ ] Proper error responses (400, 404, 500)

### V2 Testing ☑️

- [ ] User registration and authentication
- [ ] JWT token refresh workflow
- [ ] Playlist CRUD operations
- [ ] Playlist-song management
- [ ] Collaboration features
- [ ] Activity tracking
- [ ] Authorization checks (owner vs collaborator)

### V3 Testing ☑️

- [ ] **Upload album cover** (various file types/sizes)
- [ ] **Album likes** (like, unlike, duplicate prevention)
- [ ] **Caching behavior** (X-Data-Source header)
- [ ] **Cache invalidation** (after like/unlike)
- [ ] **Export playlist** (email with JSON attachment)
- [ ] **Storage switching** (Local ↔ S3)

### Performance Testing ☑️

- [ ] Cache reduces database queries
- [ ] File upload handles large files gracefully
- [ ] Concurrent like requests handled properly
- [ ] Export queue processes requests asynchronously

---

**Status:** ✅ **OpenMusic API v3 - All Testing Scenarios Covered**

> **Next Steps:** Import Postman collection dan jalankan comprehensive testing untuk memverifikasi semua fitur berfungsi dengan baik.
