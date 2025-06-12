// Handler untuk operasi autentikasi
import TokenManager from "../utils/TokenManager.js";
import BaseHandler from "./BaseHandler.js";

class AuthenticationsHandler extends BaseHandler {
  constructor(authenticationsService, usersService, validator) {
    super();
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  // POST /authentications - login user
  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);

      const { username, password } = request.payload;

      // Verifikasi kredensial user
      const id = await this._usersService.verifyUserCredential(
        username,
        password
      );

      // Generate token
      const accessToken = TokenManager.generateAccessToken({ id });
      const refreshToken = TokenManager.generateRefreshToken({ id });

      // Simpan refresh token
      await this._authenticationsService.addRefreshToken(refreshToken);

      return this._createSuccessResponse(
        h,
        { accessToken, refreshToken },
        "Authentication berhasil ditambahkan",
        201
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // PUT /authentications - refresh access token
  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      // Verifikasi refresh token ada di database
      await this._authenticationsService.verifyRefreshToken(refreshToken);

      // Verifikasi tanda tangan refresh token
      const { id } = TokenManager.verifyRefreshToken(refreshToken);

      // Generate access token baru
      const accessToken = TokenManager.generateAccessToken({ id });

      return this._createSuccessResponse(
        h,
        { accessToken },
        "Access Token berhasil diperbarui"
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // DELETE /authentications - logout user
  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;

      // Verifikasi refresh token ada di database
      await this._authenticationsService.verifyRefreshToken(refreshToken);

      // Hapus refresh token dari database
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return this._createSuccessResponse(
        h,
        null,
        "Refresh token berhasil dihapus"
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }
}

export default AuthenticationsHandler;
