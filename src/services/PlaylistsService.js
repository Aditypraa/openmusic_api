// Service untuk menangani business logic terkait playlists
// Mengatur operasi CRUD playlists dengan fitur ownership dan collaboration

import { nanoid } from "nanoid";
import InvariantError from "../exceptions/InvariantError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import AuthorizationError from "../exceptions/AuthorizationError.js";

class PlaylistsService {
  constructor(pool, collaborationService) {
    this._pool = pool;
    this._collaborationService = collaborationService;
  }

  // Buat playlist baru
  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  // Get semua playlists yang dimiliki atau bisa diakses user
  async getPlaylists(owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
             FROM playlists p 
             LEFT JOIN users u ON u.id = p.owner 
             LEFT JOIN collaborations c ON c.playlist_id = p.id 
             WHERE p.owner = $1 OR c.user_id = $1 
             GROUP BY p.id, p.name, u.username`,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  // Get playlist berdasarkan ID
  async getPlaylistById(id) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
             FROM playlists p 
             LEFT JOIN users u ON u.id = p.owner 
             WHERE p.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    return result.rows[0];
  }

  // Update nama playlist
  async editPlaylistById(id, { name }) {
    const query = {
      text: "UPDATE playlists SET name = $1, updated_at = current_timestamp WHERE id = $2 RETURNING id",
      values: [name, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui playlist. Id tidak ditemukan");
    }
  }

  // Hapus playlist
  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
    }
  }

  // Tambah lagu ke playlist
  async addSongToPlaylist(playlistId, songId) {
    // Verifikasi lagu exists
    await this.verifySong(songId);

    const query = {
      text: "INSERT INTO playlist_songs (playlist_id, song_id) VALUES($1, $2) RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }
  }

  // Hapus lagu dari playlist
  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal dihapus dari playlist");
    }
  }

  // Get semua lagu dalam playlist
  async getPlaylistSongs(playlistId) {
    // Get info playlist terlebih dahulu
    const playlistQuery = {
      text: `SELECT p.id, p.name, u.username 
             FROM playlists p 
             LEFT JOIN users u ON u.id = p.owner 
             WHERE p.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    // Get lagu-lagu dalam playlist
    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer 
             FROM songs s 
             INNER JOIN playlist_songs ps ON s.id = ps.song_id 
             WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    return {
      playlist: playlistResult.rows[0],
      songs: songsResult.rows,
    };
  }

  // Verifikasi user punya akses ke playlist (owner atau collaborator)
  async verifyPlaylistAccess(playlistId, userId) {
    // Check apakah user adalah owner
    const ownerQuery = {
      text: "SELECT owner FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const ownerResult = await this._pool.query(ownerQuery);

    if (!ownerResult.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const { owner } = ownerResult.rows[0];

    // Allow access jika user adalah owner
    if (owner === userId) {
      return;
    }

    // Check apakah user adalah collaborator
    await this._collaborationService.verifyCollaborator(playlistId, userId);
  }

  // Verifikasi user adalah owner playlist (check ketat untuk edit/delete)
  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: "SELECT owner FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const { owner } = result.rows[0];

    if (owner !== userId) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  // Verifikasi lagu exists di tabel songs
  async verifySong(songId) {
    const query = {
      text: "SELECT id FROM songs WHERE id = $1",
      values: [songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
  }

  // Tambah activity record untuk operasi playlist song
  async addActivity(playlistId, songId, userId, action) {
    const query = {
      text: "INSERT INTO playlist_song_activities (playlist_id, song_id, user_id, action) VALUES($1, $2, $3, $4)",
      values: [playlistId, songId, userId, action],
    };

    await this._pool.query(query);
  }

  // Get aktivitas playlist
  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, psa.action, psa.time 
             FROM playlist_song_activities psa 
             LEFT JOIN users u ON u.id = psa.user_id 
             LEFT JOIN songs s ON s.id = psa.song_id 
             WHERE psa.playlist_id = $1 
             ORDER BY psa.time ASC`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

export default PlaylistsService;
