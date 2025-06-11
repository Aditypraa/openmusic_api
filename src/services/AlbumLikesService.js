// Album Likes Service for OpenMusic API v3
import { nanoid } from "nanoid";
import InvariantError from "../exceptions/InvariantError.js";
import NotFoundError from "../exceptions/NotFoundError.js";

class AlbumLikesService {
  constructor(pool, cacheService) {
    this._pool = pool;
    this._cacheService = cacheService;
  }

  async addLike(userId, albumId) {
    // Check if album exists
    await this.verifyAlbumExists(albumId);

    // Check if user already liked this album
    await this.verifyUserNotLikedAlbum(userId, albumId);

    const id = `like-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: "INSERT INTO album_likes (id, user_id, album_id, created_at) VALUES($1, $2, $3, $4)",
      values: [id, userId, albumId, createdAt],
    };

    await this._pool.query(query);

    // Delete cache when likes change
    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async removeLike(userId, albumId) {
    // Check if album exists
    await this.verifyAlbumExists(albumId);

    const query = {
      text: "DELETE FROM album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(
        "Gagal batal menyukai album. Album belum disukai"
      );
    }

    // Delete cache when likes change
    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async getLikesCount(albumId) {
    // Check if album exists
    await this.verifyAlbumExists(albumId);

    try {
      // Try to get from cache first
      const result = await this._cacheService.get(`album_likes:${albumId}`);
      return {
        likes: parseInt(result),
        source: "cache",
      };
    } catch {
      // If not in cache, get from database
      const query = {
        text: "SELECT COUNT(*) as likes FROM album_likes WHERE album_id = $1",
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likes = parseInt(result.rows[0].likes);

      // Store in cache for 30 minutes (1800 seconds)
      await this._cacheService.set(
        `album_likes:${albumId}`,
        likes.toString(),
        1800
      );

      return {
        likes,
        source: "database",
      };
    }
  }

  async verifyAlbumExists(albumId) {
    const query = {
      text: "SELECT id FROM albums WHERE id = $1",
      values: [albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }
  }

  async verifyUserNotLikedAlbum(userId, albumId) {
    const query = {
      text: "SELECT id FROM album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length) {
      throw new InvariantError("Anda sudah menyukai album ini");
    }
  }
}

export default AlbumLikesService;
