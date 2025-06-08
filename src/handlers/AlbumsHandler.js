// Handler untuk operasi CRUD album
import BaseHandler from "./BaseHandler.js";

class AlbumsHandler extends BaseHandler {
  constructor(service, validator) {
    super();
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  // POST /albums - tambah album baru
  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      const albumId = await this._service.addAlbum({ name, year });

      return this._createSuccessResponse(
        h,
        { albumId },
        "Album berhasil ditambahkan",
        201
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // GET /albums/{id} - ambil album dengan lagu
  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbumWithSongs(id);

      return this._createSuccessResponse(h, { album });
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // PUT /albums/{id} - edit album
  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const { id } = request.params;

      await this._service.editAlbumById(id, { name, year });

      return this._createSuccessResponse(h, null, "Album berhasil diperbarui");
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // DELETE /albums/{id} - hapus album
  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);

      return this._createSuccessResponse(h, null, "Album berhasil dihapus");
    } catch (error) {
      return this._handleError(error, h);
    }
  }
}

export default AlbumsHandler;
