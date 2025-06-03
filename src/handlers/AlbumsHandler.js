// Import ClientError untuk error handling
import ClientError from "../exceptions/ClientError.js";

// Handler class untuk menangani HTTP requests terkait albums
// Bertugas sebagai controller yang menerima request, validasi, dan mengembalikan response
class AlbumsHandler {
  constructor(service, validator) {
    this._service = service; // Dependency injection untuk AlbumsService
    this._validator = validator; // Dependency injection untuk AlbumsValidator

    // Bind context untuk setiap handler method
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  // Handler untuk menambahkan album baru (POST /albums)
  async postAlbumHandler(request, h) {
    try {
      // Validasi payload menggunakan Joi schema
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      // Panggil service untuk menyimpan album ke database
      const albumId = await this._service.addAlbum({ name, year });

      // Response sukses dengan status 201 Created
      const response = h.response({
        status: "success",
        message: "Menambahkan album",
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      // Error handling untuk client error dan server error
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR! - Internal server error handling
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // Handler untuk mendapatkan album berdasarkan ID (GET /albums/{id})
  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params; // Ambil ID dari URL parameter
      // Panggil service untuk mendapatkan album beserta lagu-lagunya
      const album = await this._service.getAlbumWithSongs(id);

      // Response sukses dengan data album
      const response = h.response({
        status: "success",
        message: "Mendapatkan album berdasarkan id",
        data: {
          album,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      // Error handling untuk client error (album tidak ditemukan)
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR! - Internal server error handling
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // Handler untuk mengupdate album berdasarkan ID (PUT /albums/{id})
  async putAlbumByIdHandler(request, h) {
    try {
      // Validasi payload sebelum update
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
      const { id } = request.params; // Ambil ID dari URL parameter

      // Panggil service untuk update album di database
      await this._service.editAlbumById(id, { name, year });

      // Response sukses untuk update
      const response = h.response({
        status: "success",
        message: "Mengubah album berdasarkan id album",
      });
      response.code(200);
      return response;
    } catch (error) {
      // Error handling untuk client error dan server error
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR! - Internal server error handling
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // Handler untuk menghapus album berdasarkan ID (DELETE /albums/{id})
  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params; // Ambil ID dari URL parameter
      // Panggil service untuk menghapus album dari database
      await this._service.deleteAlbumById(id);

      // Response sukses untuk delete operation
      const response = h.response({
        status: "success",
        message: "Menghapus album berdasarkan id",
      });
      response.code(200);
      return response;
    } catch (error) {
      // Error handling untuk client error dan server error
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR! - Internal server error handling
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

export default AlbumsHandler;
