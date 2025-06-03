// Import dependencies untuk service layer
import { nanoid } from "nanoid"; // Library untuk generate unique ID
import pool from "../utils/database.js"; // Database connection pool
import NotFoundError from "../exceptions/NotFoundError.js"; // Error untuk resource tidak ditemukan
import InvariantError from "../exceptions/InvariantError.js"; // Error untuk validasi/invariant

// Service class untuk handle business logic songs
class SongsService {
  constructor() {
    // Inisialisasi database connection pool
    this._pool = pool;
  }

  // Method untuk menambahkan song baru ke database
  // Parameter: { title, year, genre, performer, duration, albumId } - Data song yang akan disimpan
  // duration dan albumId bersifat optional (bisa null/undefined)
  async addSong({ title, year, genre, performer, duration, albumId }) {
    // Generate unique ID untuk song baru dengan prefix 'song-'
    // Menggunakan nanoid(16) untuk membuat ID yang unik dan tidak mudah ditebak
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString(); // Timestamp untuk created_at dalam format ISO 8601
    const updatedAt = createdAt; // Pada insert, updated_at sama dengan created_at

    // Query SQL untuk insert song baru ke database
    // INSERT INTO songs VALUES(id, title, year, performer, genre, duration, album_id, created_at, updated_at) RETURNING id
    // Perhatikan urutan kolom sesuai dengan schema database yang telah didefinisikan di migration
    // $1-$9 adalah parameter placeholder untuk mencegah SQL injection
    // RETURNING id akan mengembalikan ID yang baru saja diinsert untuk konfirmasi
    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      values: [
        id, // $1: Primary key song
        title, // $2: Judul lagu (required)
        year, // $3: Tahun rilis (required)
        performer, // $4: Penyanyi/performer (required)
        genre, // $5: Genre musik (required)
        duration, // $6: Durasi dalam detik (optional, bisa null)
        albumId, // $7: Foreign key ke albums (optional, bisa null jika lagu tidak terkait album)
        createdAt, // $8: Timestamp pembuatan record
        updatedAt, // $9: Timestamp update terakhir
      ],
    };

    // Eksekusi query menggunakan database connection pool
    // await digunakan karena query database adalah operasi asynchronous
    const result = await this._pool.query(query);

    // Validasi apakah insert berhasil dengan memeriksa return value
    // Jika insert gagal, result.rows[0].id akan undefined atau null
    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    // Return ID song yang baru saja ditambahkan untuk response client
    return result.rows[0].id;
  }

  // Method untuk mendapatkan daftar songs dengan optional search functionality (optional criteria)
  // Implementasi fitur pencarian berdasarkan title dan/atau performer
  // Parameter: title (string|undefined), performer (string|undefined) - Parameter pencarian optional
  // Return: array of objects berisi songs yang sesuai criteria atau semua songs jika tidak ada filter
  async getSongs(title, performer) {
    // Query dasar untuk mengambil semua songs (hanya field yang diperlukan untuk list)
    // SELECT id, title, performer FROM songs
    // Hanya mengambil field minimal yang dibutuhkan untuk performa yang lebih baik
    let query = {
      text: "SELECT id, title, performer FROM songs",
      values: [], // Akan diisi jika ada parameter pencarian
    };

    // Array untuk menyimpan kondisi WHERE yang akan digabungkan dengan AND
    const conditions = [];
    // Array untuk menyimpan nilai parameter yang akan dipass ke query
    const values = [];

    // Jika ada parameter title, tambahkan kondisi pencarian case-insensitive
    // ILIKE adalah operator PostgreSQL untuk pattern matching case-insensitive
    if (title) {
      conditions.push(`title ILIKE $${values.length + 1}`); // Dinamis placeholder $1, $2, dst
      values.push(`%${title}%`); // Wrap dengan % untuk partial match (LIKE '%keyword%')
    }

    // Jika ada parameter performer, tambahkan kondisi pencarian case-insensitive
    // Bisa dikombinasikan dengan pencarian title menggunakan AND
    if (performer) {
      conditions.push(`performer ILIKE $${values.length + 1}`); // Placeholder dinamis
      values.push(`%${performer}%`); // Wrap dengan % untuk partial match
    }

    // Jika ada kondisi pencarian, tambahkan WHERE clause ke query
    // Menggabungkan semua kondisi dengan operator AND
    // Contoh hasil: "SELECT id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2"
    if (conditions.length > 0) {
      query.text += ` WHERE ${conditions.join(" AND ")}`;
      query.values = values; // Assign parameter values ke query object
    }

    // Eksekusi query ke database dan return hasil
    // Query akan berbeda tergantung ada tidaknya parameter pencarian
    const result = await this._pool.query(query);
    return result.rows; // Return array songs (bisa kosong jika tidak ada yang match)
  }

  // Method untuk mendapatkan song berdasarkan ID
  // Parameter: id (string) - ID song yang dicari
  // Return: object song lengkap atau throw NotFoundError jika tidak ditemukan
  async getSongById(id) {
    // Query SQL untuk mencari song berdasarkan ID
    // SELECT * FROM songs WHERE id = $1
    // Menggunakan wildcard (*) untuk mengambil semua kolom karena ini detail song
    // WHERE clause dengan parameter $1 untuk filter berdasarkan ID
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id], // ID yang dicari, dipass sebagai parameter untuk keamanan
    };
    const result = await this._pool.query(query);

    // Validasi apakah song ditemukan
    // Jika tidak ada row yang dikembalikan, berarti song dengan ID tersebut tidak ada
    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    // Return data song lengkap yang ditemukan (object dengan semua kolom)
    return result.rows[0];
  }

  // Method untuk mengupdate data song berdasarkan ID
  // Parameter: id (string), { title, year, genre, performer, duration, albumId } - Data baru untuk song
  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString(); // Update timestamp saat ini dalam ISO format

    // Query SQL untuk update semua field song dan return ID untuk validasi
    // UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, album_id=$6, updated_at=$7 WHERE id=$8 RETURNING id
    // SET clause untuk mengubah nilai semua kolom yang bisa diupdate
    // WHERE id = $8 untuk spesifikasi song mana yang akan diupdate
    // RETURNING id untuk konfirmasi bahwa update berhasil dan record ditemukan
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, updatedAt, id], // Parameter sesuai urutan placeholder
    };

    // Eksekusi query update ke database
    const result = await this._pool.query(query);

    // Validasi apakah update berhasil (song dengan ID tersebut ada)
    // Jika tidak ada row yang affected/returned, berarti ID song tidak ditemukan
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
    }
    // Method tidak return value karena hanya melakukan update operation
  }

  // Method untuk menghapus song berdasarkan ID
  // Parameter: id (string) - ID song yang akan dihapus
  async deleteSongById(id) {
    // Query SQL untuk delete song dan return ID untuk validasi
    // DELETE FROM songs WHERE id = $1 RETURNING id
    // WHERE id = $1 untuk spesifikasi song mana yang akan dihapus
    // RETURNING id untuk konfirmasi bahwa delete berhasil dan record ditemukan
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id], // ID song yang akan dihapus
    };

    // Eksekusi query delete ke database
    const result = await this._pool.query(query);

    // Validasi apakah delete berhasil (song dengan ID tersebut ada)
    // Jika tidak ada row yang affected/returned, berarti ID song tidak ditemukan
    if (!result.rows.length) {
      throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
    }
    // Method tidak return value karena hanya melakukan delete operation
  }
}

export default SongsService;
