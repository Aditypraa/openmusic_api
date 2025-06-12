// Handler untuk operasi CRUD lagu
import BaseHandler from "./BaseHandler.js";

class SongsHandler extends BaseHandler {
  constructor(service, validator) {
    super();
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  // POST /songs - tambah lagu baru
  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } =
        request.payload;

      const songId = await this._service.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      return this._createSuccessResponse(
        h,
        { songId },
        "Lagu berhasil ditambahkan",
        201
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // GET /songs - ambil semua lagu dengan filter opsional
  async getSongsHandler(request, h) {
    try {
      const { title, performer } = request.query;
      const songs = await this._service.getSongs(title, performer);

      return this._createSuccessResponse(h, { songs });
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // GET /songs/{id} - ambil lagu berdasarkan ID
  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._service.getSongById(id);

      // Format response sesuai spesifikasi API
      const songResponse = {
        ...song,
        albumId: song.album_id,
      };
      delete songResponse.album_id;
      delete songResponse.created_at;
      delete songResponse.updated_at;

      return this._createSuccessResponse(h, { song: songResponse });
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // PUT /songs/{id} - edit lagu
  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } =
        request.payload;
      const { id } = request.params;

      await this._service.editSongById(id, {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      return this._createSuccessResponse(h, null, "Lagu berhasil diperbarui");
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // DELETE /songs/{id} - hapus lagu
  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteSongById(id);

      return this._createSuccessResponse(h, null, "Lagu berhasil dihapus");
    } catch (error) {
      return this._handleError(error, h);
    }
  }
}

export default SongsHandler;
