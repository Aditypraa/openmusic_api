// Import dependencies untuk service layer
import { nanoid } from "nanoid"; // Library untuk generate unique ID
import pool from "../utils/database.js"; // Database connection pool
import NotFoundError from "../exceptions/NotFoundError.js"; // Error untuk resource tidak ditemukan
import InvariantError from "../exceptions/InvariantError.js"; // Error untuk validasi/invariant

// Service class untuk handle business logic albums
class AlbumsService {
  constructor() {
    // Inisialisasi database connection pool
    this._pool = pool;
  }

  // Method untuk menambahkan album baru ke database
  // Parameter: { name: string, year: integer } - Data album yang akan disimpan
  async addAlbum({ name, year }) {
    // Generate unique ID untuk album baru dengan prefix 'album-'
    // Menggunakan nanoid(16) untuk membuat ID yang unik dan tidak mudah ditebak
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString(); // Timestamp untuk created_at dalam format ISO 8601
    const updatedAt = createdAt; // Pada insert, updated_at sama dengan created_at

    // Query SQL untuk insert album baru ke database
    // INSERT INTO albums VALUES(id, name, year, created_at, updated_at) RETURNING id
    // $1-$5 adalah parameter placeholder untuk mencegah SQL injection
    // RETURNING id akan mengembalikan ID yang baru saja diinsert untuk konfirmasi
    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, name, year, createdAt, updatedAt], // Urutan sesuai dengan kolom di tabel albums
    };

    // Eksekusi query menggunakan database connection pool
    // await digunakan karena query database adalah operasi asynchronous
    const result = await this._pool.query(query);

    // Validasi apakah insert berhasil dengan memeriksa return value
    // Jika insert gagal, result.rows[0].id akan undefined atau null
    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    // Return ID album yang baru saja ditambahkan untuk response client
    return result.rows[0].id;
  }

  // Method untuk mendapatkan album berdasarkan ID
  // Parameter: id (string) - ID album yang dicari
  // Return: object album atau throw NotFoundError jika tidak ditemukan
  async getAlbumById(id) {
    // Query SQL untuk mencari album berdasarkan ID
    // SELECT * FROM albums WHERE id = $1
    // Menggunakan wildcard (*) untuk mengambil semua kolom dari tabel albums
    // WHERE clause dengan parameter $1 untuk filter berdasarkan ID
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id], // ID yang dicari, dipass sebagai parameter untuk keamanan
    };
    const result = await this._pool.query(query);

    // Validasi apakah album ditemukan
    // Jika tidak ada row yang dikembalikan, berarti album dengan ID tersebut tidak ada
    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    // Return data album yang ditemukan (object dengan semua kolom)
    return result.rows[0];
  }

  // Method untuk mendapatkan album beserta songs yang ada di dalamnya (optional criteria)
  // Implementasi relasi one-to-many antara albums dan songs
  // Parameter: id (string) - ID album yang dicari
  // Return: object album dengan property 'songs' berisi array lagu-lagu
  async getAlbumWithSongs(id) {
    // Query pertama: mendapatkan data album
    // SELECT * FROM albums WHERE id = $1
    // Sama seperti getAlbumById, tetapi akan digabung dengan data songs
    const albumQuery = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };
    const albumResult = await this._pool.query(albumQuery);

    // Validasi apakah album ditemukan
    // Jika album tidak ada, langsung throw error sebelum query songs
    if (!albumResult.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    // Query kedua: mendapatkan lagu-lagu yang ada di album tersebut
    // SELECT id, title, performer FROM songs WHERE album_id = $1
    // Hanya ambil field yang diperlukan untuk response: id, title, performer
    // album_id adalah foreign key yang menghubungkan songs dengan albums
    // WHERE album_id = $1 untuk filter lagu berdasarkan ID album
    const songsQuery = {
      text: "SELECT id, title, performer FROM songs WHERE album_id = $1",
      values: [id], // ID album yang sama untuk mencari lagu-lagu di dalamnya
    };
    const songsResult = await this._pool.query(songsQuery);

    // Gabungkan data album dengan array songs
    // Mengambil data album dari result pertama
    const album = albumResult.rows[0];
    // Menambahkan property 'songs' yang berisi array lagu-lagu dalam album
    // Jika tidak ada lagu, songs akan berupa array kosong []
    album.songs = songsResult.rows;

    // Return object album yang sudah dilengkapi dengan data songs
    return album;
  }

  // Method untuk mengupdate data album berdasarkan ID
  // Parameter: id (string), { name: string, year: integer } - Data baru untuk album
  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString(); // Update timestamp saat ini dalam ISO format

    // Query SQL untuk update data album dan return ID untuk validasi
    // UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id
    // SET clause untuk mengubah nilai kolom name, year, dan updated_at
    // WHERE id = $4 untuk spesifikasi album mana yang akan diupdate
    // RETURNING id untuk konfirmasi bahwa update berhasil dan record ditemukan
    const query = {
      text: "UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id",
      values: [name, year, updatedAt, id], // Parameter sesuai urutan placeholder
    };

    // Eksekusi query update ke database
    const result = await this._pool.query(query);

    // Validasi apakah update berhasil (album dengan ID tersebut ada)
    // Jika tidak ada row yang affected/returned, berarti ID album tidak ditemukan
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
    // Method tidak return value karena hanya melakukan update operation
  }

  // Method untuk menghapus album berdasarkan ID
  // Parameter: id (string) - ID album yang akan dihapus
  // Note: Karena ada foreign key constraint dengan CASCADE, semua songs dalam album juga akan terhapus
  async deleteAlbumById(id) {
    // Query SQL untuk delete album dan return ID untuk validasi
    // DELETE FROM albums WHERE id = $1 RETURNING id
    // WHERE id = $1 untuk spesifikasi album mana yang akan dihapus
    // RETURNING id untuk konfirmasi bahwa delete berhasil dan record ditemukan
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id], // ID album yang akan dihapus
    };

    // Eksekusi query delete ke database
    const result = await this._pool.query(query);

    // Validasi apakah delete berhasil (album dengan ID tersebut ada)
    // Jika tidak ada row yang affected/returned, berarti ID album tidak ditemukan
    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
    // Method tidak return value karena hanya melakukan delete operation
  }
}

export default AlbumsService;
