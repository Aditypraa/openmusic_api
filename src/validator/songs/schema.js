// Import Joi library untuk membuat validation schema
import Joi from "joi";

// SongPayloadSchema - Joi schema untuk validasi data song
// Kriteria 3: Implementasi data validation dengan aturan validasi yang ketat
// Schema ini digunakan untuk memvalidasi payload POST dan PUT request song
const SongPayloadSchema = Joi.object({
  // Field title: harus berupa string dan wajib ada (required)
  title: Joi.string().required(),

  // Field year: harus berupa integer dengan validasi range
  year: Joi.number()
    .integer() // Harus berupa bilangan bulat
    .min(1900) // Tahun minimum 1900 (lagu pertama tidak mungkin sebelum ini)
    .max(new Date().getFullYear()) // Tahun maksimum adalah tahun saat ini
    .required(), // Field ini wajib ada

  // Field genre: harus berupa string dan wajib ada (required)
  genre: Joi.string().required(),

  // Field performer: harus berupa string dan wajib ada (required)
  performer: Joi.string().required(),

  // Field duration: optional, harus berupa integer positif (dalam detik)
  duration: Joi.number().integer().positive(),

  // Field albumId: optional, harus berupa string (ID album tempat lagu berada)
  albumId: Joi.string(),
});

export default SongPayloadSchema;
