// Import base ClientError class
import ClientError from "./ClientError.js";

// NotFoundError - Custom exception untuk resource yang tidak ditemukan
// Kriteria 4: Implementasi error handling dengan custom error class
// Digunakan ketika resource yang diminta (album/song) tidak ditemukan di database
// Mewarisi dari ClientError dengan status code 404 (Not Found)
class NotFoundError extends ClientError {
  // Constructor untuk NotFoundError dengan message
  constructor(message) {
    // Panggil constructor parent class (ClientError) dengan status code 404
    super(message, 404);
    // Set nama error untuk debugging dan logging
    this.name = "NotFoundError";
  }
}

export default NotFoundError;
