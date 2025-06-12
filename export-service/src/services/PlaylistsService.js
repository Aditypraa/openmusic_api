// Playlist Service for Export Service
import pool from "../utils/database.js";

class PlaylistsService {
  constructor() {
    this._pool = pool;
  }

  async testConnection() {
    try {
      const result = await this._pool.query("SELECT NOW()");
      return result;
    } catch (error) {
      throw new Error(`Database connection test failed: ${error.message}`);
    }
  }

  async getPlaylistById(playlistId) {
    const playlistQuery = {
      text: `SELECT id, name FROM playlists WHERE id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer 
             FROM songs s
             INNER JOIN playlist_songs ps ON s.id = ps.song_id
             WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    return {
      playlist: {
        ...playlistResult.rows[0],
        songs: songsResult.rows,
      },
    };
  }
}

export default PlaylistsService;
