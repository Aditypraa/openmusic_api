// Service untuk menangani business logic terkait albums
// Mengatur operasi CRUD albums dengan database

import { nanoid } from "nanoid";
import pool from "../utils/database.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import InvariantError from "../exceptions/InvariantError.js";

class AlbumsService {
  constructor(databasePool) {
    this._pool = databasePool || pool;
  }

  // Tambah album baru ke database
  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, year, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }
  // Get album berdasarkan ID
  async getAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year, cover_url as "coverUrl" FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    return result.rows[0];
  }

  // Get album dengan songs didalamnya (optional criteria)
  async getAlbumWithSongs(id) {
    const albumQuery = {
      text: 'SELECT id, name, year, cover_url as "coverUrl" FROM albums WHERE id = $1',
      values: [id],
    };
    const albumResult = await this._pool.query(albumQuery);

    if (!albumResult.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    // Ambil lagu-lagu dalam album
    const songsQuery = {
      text: "SELECT id, title, performer FROM songs WHERE album_id = $1",
      values: [id],
    };
    const songsResult = await this._pool.query(songsQuery);

    const album = albumResult.rows[0];
    album.songs = songsResult.rows;

    return album;
  }

  // Update album berdasarkan ID
  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  // Update album cover berdasarkan ID
  async editAlbumCoverById(id, coverUrl) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE albums SET cover_url = $1, updated_at = $2 WHERE id = $3 RETURNING id",
      values: [coverUrl, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        "Gagal memperbarui cover album. Id tidak ditemukan"
      );
    }
  }

  // Hapus album berdasarkan ID
  // Note: CASCADE akan menghapus semua songs dalam album
  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }
}

export default AlbumsService;
