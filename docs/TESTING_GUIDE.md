# Testing Guide

## Quick Setup

1. **Environment Setup**

   ```bash
   npm install
   cp .env.example .env
   # Configure database settings in .env
   ```

2. **Database Setup**

   ```bash
   npm run migrate:up
   ```

3. **Start Server**

   ```bash
   npm run dev
   ```

4. **Setup Sample Data (Optional)**
   ```bash
   npm run setup:sample
   ```

## Testing Flow

### 1. V1 Endpoints Testing (Public Access)

- Create album: `POST /albums`
- Get album details: `GET /albums/{id}`
- Update album: `PUT /albums/{id}`
- Delete album: `DELETE /albums/{id}`
- Create song: `POST /songs`
- Get all songs: `GET /songs`
- Get song details: `GET /songs/{id}`
- Update song: `PUT /songs/{id}`
- Delete song: `DELETE /songs/{id}`
- Search songs: `GET /songs?title=&performer=`

### 2. Authentication Testing

- Register new user: `POST /users`
- Login user: `POST /authentications`
- Refresh token: `PUT /authentications`
- Logout: `DELETE /authentications`

### 3. Playlist Management

- Create playlist: `POST /playlists`
- Get user playlists: `GET /playlists`
- Get playlist songs: `GET /playlists/{id}/songs`
- Add songs to playlist: `POST /playlists/{id}/songs`
- Delete songs from playlist: `DELETE /playlists/{id}/songs`
- Delete playlist: `DELETE /playlists/{id}`

### 4. Collaboration Testing

- Add collaborator: `POST /collaborations`
- Remove collaborator: `DELETE /collaborations`
- Test collaborative access to playlists

### 5. Activities Testing

- Get playlist activities: `GET /playlists/{id}/activities`

### 6. OpenMusic API v3 Features Testing

#### Upload Album Cover

- Upload cover image: `POST /albums/{id}/covers`
  - Use multipart/form-data
  - Field name: "cover"
  - Max size: 512KB
  - Supported formats: JPEG, PNG, GIF, WEBP, AVIF, APNG
  - Response includes coverUrl in album details

#### Album Likes (Authentication Required)

- Like an album: `POST /albums/{id}/likes`
- Unlike an album: `DELETE /albums/{id}/likes`
- Get likes count: `GET /albums/{id}/likes`
  - Response includes custom header `X-Data-Source: cache` when data comes from cache
  - Cache expires after 30 minutes

#### Export Playlist (Authentication Required)

- Export playlist: `POST /export/playlists/{playlistId}`
  - Body: `{ "targetEmail": "user@example.com" }`
  - Only playlist owner can export
  - Uses RabbitMQ message broker
  - Sends email with JSON attachment

## Development Commands

- `npm run dev` - Start development server
- `npm run migrate:up` - Run database migrations
- `npm run migrate:down` - Rollback migrations
- `npm run setup:sample` - Setup sample data for testing
- `npm run test:db` - Test database connection

## Common Issues

1. **Database Connection**: Verify PostgreSQL is running and .env config is correct
2. **JWT Errors**: Check token expiration and refresh flow
3. **CORS Issues**: Check allowed origins in server configuration

## Expected Results

- All endpoints should return proper HTTP status codes
- JWT authentication should work across all protected routes
- Database constraints should prevent invalid data
- Collaboration features should maintain proper access control

## Postman Collection

Import the collection from `postman/` directory for complete API testing scenarios.
