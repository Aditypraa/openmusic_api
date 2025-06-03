// Import dependencies untuk validasi albums
import InvariantError from "../../exceptions/InvariantError.js"; // Error untuk validasi yang gagal
import AlbumPayloadSchema from "./schema.js"; // Joi schema untuk album payload

// AlbumsValidator - Validator untuk memvalidasi data album
// Menggunakan Joi schema untuk memastikan data yang masuk sesuai format
// Kriteria 3: Implementasi data validation menggunakan Joi
const AlbumsValidator = {
  // Memvalidasi payload album (untuk POST dan PUT request)
  // Jika validasi gagal akan throw InvariantError dengan pesan error detail
  validateAlbumPayload: (payload) => {
    // Jalankan validasi menggunakan Joi schema
    const validationResult = AlbumPayloadSchema.validate(payload);

    // Jika ada error validasi, throw InvariantError dengan pesan detail
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default AlbumsValidator;
