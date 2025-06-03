// Import ClientError untuk error handling
import ClientError from "../exceptions/ClientError.js";

// Handler class untuk menangani HTTP requests terkait songs
// Bertugas sebagai controller yang menerima request, validasi, dan mengembalikan response
class SongsHandler {
  constructor(service, validator) {
    this._service = service; // Dependency injection untuk SongsService
    this._validator = validator; // Dependency injection untuk SongsValidator

    // Bind context untuk setiap handler method
    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  // Handler untuk menambahkan song baru (POST /songs)
  async postSongHandler(request, h) {
    try {
      // Validasi payload menggunakan Joi schema
      this._validator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } =
        request.payload;

      // Panggil service untuk menyimpan song ke database
      const songId = await this._service.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      // Response sukses dengan status 201 Created
      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan",
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // Handler untuk mendapatkan daftar songs dengan query parameters (GET /songs)
  async getSongsHandler(request, h) {
    try {
      // Ambil query parameters untuk search functionality
      const { title, performer } = request.query;
      // Panggil service untuk mendapatkan songs dengan filter optional
      const songs = await this._service.getSongs(title, performer);

      // Response sukses dengan data songs
      return {
        status: "success",
        data: {
          songs,
        },
      };
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

  // Handler untuk mendapatkan song berdasarkan ID (GET /songs/{id})
  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params; // Ambil ID dari URL parameter
      // Panggil service untuk mendapatkan song berdasarkan ID
      const song = await this._service.getSongById(id);

      // Convert album_id to albumId untuk response format yang sesuai
      const songResponse = {
        ...song,
        albumId: song.album_id,
      };
      // Hapus field yang tidak perlu di response
      delete songResponse.album_id;
      delete songResponse.created_at;
      delete songResponse.updated_at;

      // Response sukses dengan data song
      return {
        status: "success",
        data: {
          song: songResponse,
        },
      };
    } catch (error) {
      // Error handling untuk client error (song tidak ditemukan)
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // Handler untuk mengupdate song berdasarkan ID (PUT /songs/{id})
  async putSongByIdHandler(request, h) {
    try {
      // Validasi payload sebelum update
      this._validator.validateSongPayload(request.payload);
      const { title, year, genre, performer, duration, albumId } =
        request.payload;
      const { id } = request.params; // Ambil ID dari URL parameter

      // Panggil service untuk update song di database
      await this._service.editSongById(id, {
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      // Response sukses untuk update operation
      return {
        status: "success",
        message: "Lagu berhasil diperbarui",
      };
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

  // Handler untuk menghapus song berdasarkan ID (DELETE /songs/{id})
  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params; // Ambil ID dari URL parameter
      // Panggil service untuk menghapus song berdasarkan ID
      // Service akan throw NotFoundError jika song tidak ditemukan
      await this._service.deleteSongById(id);

      // Response sukses setelah song berhasil dihapus
      return {
        status: "success",
        message: "Lagu berhasil dihapus",
      };
    } catch (error) {
      // Error handling untuk client error (song tidak ditemukan)
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

export default SongsHandler;
