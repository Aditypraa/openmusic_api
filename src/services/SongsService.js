// Service untuk menangani business logic terkait songs
// Mengatur operasi CRUD songs dengan database

import { nanoid } from "nanoid";
import pool from "../utils/database.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import InvariantError from "../exceptions/InvariantError.js";

class SongsService {
  constructor(databasePool) {
    this._pool = databasePool || pool;
  }

  // Tambah song baru ke database
  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        createdAt,
        updatedAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  // Get songs dengan optional search filters
  async getSongs(title, performer) {
    let query = {
      text: "SELECT DISTINCT id, title, performer FROM songs",
      values: [],
    };

    const conditions = [];
    const values = [];

    // Tambah filter berdasarkan title jika ada
    if (title) {
      conditions.push(`LOWER(title) ILIKE LOWER($${values.length + 1})`);
      values.push(`%${title}%`);
    }

    // Tambah filter berdasarkan performer jika ada
    if (performer) {
      conditions.push(`LOWER(performer) ILIKE LOWER($${values.length + 1})`);
      values.push(`%${performer}%`);
    }

    // Gabungkan conditions ke query jika ada
    if (conditions.length > 0) {
      query.text += ` WHERE ${conditions.join(" AND ")}`;
      query.values = values;
    }

    console.log("Executing query:", query.text, "with values:", query.values);

    const result = await this._pool.query(query);
    console.log("Query result:", result.rows);

    return result.rows;
  }

  // Get song detail berdasarkan ID
  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows[0];
  }

  // Update song berdasarkan ID
  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
    }
  }

  // Hapus song berdasarkan ID
  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
    }
  }
}

export default SongsService;
