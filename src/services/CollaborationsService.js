// Service untuk menangani business logic terkait collaborations
// Mengatur penambahan/penghapusan collaborator dan verifikasi akses

import InvariantError from "../exceptions/InvariantError.js";
import AuthorizationError from "../exceptions/AuthorizationError.js";

class CollaborationsService {
  constructor(pool) {
    this._pool = pool;
  }

  // Tambah collaborator ke playlist
  async addCollaboration(playlistId, userId) {
    const query = {
      text: "INSERT INTO collaborations (playlist_id, user_id) VALUES($1, $2) RETURNING id",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Kolaborasi gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  // Hapus collaborator dari playlist
  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Kolaborasi gagal dihapus");
    }
  }

  // Verifikasi user adalah collaborator pada playlist
  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
}

export default CollaborationsService;
