// Handler untuk operasi user
import BaseHandler from "./BaseHandler.js";

class UsersHandler extends BaseHandler {
  constructor(service, validator) {
    super();
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
  }

  // POST /users - registrasi user baru
  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);

      const { username, password, fullname } = request.payload;

      const userId = await this._service.addUser({
        username,
        password,
        fullname,
      });

      return this._createSuccessResponse(
        h,
        { userId },
        "User berhasil ditambahkan",
        201
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // GET /users/{id} - ambil user berdasarkan ID
  async getUserByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const user = await this._service.getUserById(id);

      return this._createSuccessResponse(h, { user });
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // GET /users - cari user berdasarkan username
  async getUsersByUsernameHandler(request, h) {
    try {
      const { username = "" } = request.query;

      const users = await this._service.getUsersByUsername(username);

      return this._createSuccessResponse(h, { users });
    } catch (error) {
      return this._handleError(error, h);
    }
  }
}

export default UsersHandler;
