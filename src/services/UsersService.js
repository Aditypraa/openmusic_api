// Service untuk menangani business logic terkait users
// Mengatur registrasi, authentication, dan profile management

import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import InvariantError from "../exceptions/InvariantError.js";
import NotFoundError from "../exceptions/NotFoundError.js";
import AuthenticationError from "../exceptions/AuthenticationError.js";

class UsersService {
  constructor(pool) {
    this._pool = pool;
  }

  // Register user baru dengan password terenkripsi
  async addUser({ username, password, fullname }) {
    // Check apakah username sudah digunakan
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    // Hash password dengan bcrypt (10 salt rounds untuk keamanan)
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("User gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  // Verifikasi username belum digunakan
  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        "Gagal menambahkan user. Username sudah digunakan."
      );
    }
  }

  // Get user berdasarkan ID
  async getUserById(userId) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  // Verify kredensial user untuk authentication
  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    const { id, password: hashedPassword } = result.rows[0];

    // Compare password dengan hashed password
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }

    return id;
  }

  // Get users berdasarkan username (untuk search)
  async getUsersByUsername(username) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE username LIKE $1",
      values: [`%${username}%`],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

export default UsersService;
