// Import dependencies untuk validasi songs
import InvariantError from "../../exceptions/InvariantError.js"; // Error untuk validasi yang gagal
import SongPayloadSchema from "./schema.js"; // Joi schema untuk song payload

// SongsValidator - Validator untuk memvalidasi data song
// Menggunakan Joi schema untuk memastikan data yang masuk sesuai format
// Kriteria 3: Implementasi data validation menggunakan Joi
const SongsValidator = {
  // Memvalidasi payload song (untuk POST dan PUT request)
  // Validasi meliputi title, year, genre, performer (required) dan duration, albumId (optional)
  // Jika validasi gagal akan throw InvariantError dengan pesan error detail
  validateSongPayload: (payload) => {
    // Jalankan validasi menggunakan Joi schema
    const validationResult = SongPayloadSchema.validate(payload);

    // Jika ada error validasi, throw InvariantError dengan pesan detail
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default SongsValidator;
