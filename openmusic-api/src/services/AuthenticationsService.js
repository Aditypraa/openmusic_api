// Service untuk menangani business logic terkait authentications
// Mengatur penyimpanan, verifikasi, dan penghapusan refresh tokens

import InvariantError from "../exceptions/InvariantError.js";

class AuthenticationsService {
  constructor(pool) {
    this._pool = pool;
  }

  // Simpan refresh token ke database
  async addRefreshToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    };

    await this._pool.query(query);
  }

  // Verifikasi refresh token ada di database
  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  // Hapus refresh token dari database
  async deleteRefreshToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };

    await this._pool.query(query);
  }
}

export default AuthenticationsService;
