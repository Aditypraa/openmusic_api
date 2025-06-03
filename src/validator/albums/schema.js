// Import Joi library untuk membuat validation schema
import Joi from "joi";

// AlbumPayloadSchema - Joi schema untuk validasi data album
// Kriteria 3: Implementasi data validation dengan aturan validasi yang ketat
// Schema ini digunakan untuk memvalidasi payload POST dan PUT request album
const AlbumPayloadSchema = Joi.object({
  // Field name: harus berupa string dan wajib ada (required)
  name: Joi.string().required(),

  // Field year: harus berupa integer dengan validasi range
  year: Joi.number()
    .integer() // Harus berupa bilangan bulat
    .min(1900) // Tahun minimum 1900 (album pertama tidak mungkin sebelum ini)
    .max(new Date().getFullYear()) // Tahun maksimum adalah tahun saat ini
    .required(), // Field ini wajib ada
});

export default AlbumPayloadSchema;
