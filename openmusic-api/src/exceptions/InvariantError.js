// Import base ClientError class
import ClientError from "./ClientError.js";

// InvariantError - Custom exception untuk error validasi dan invariant violation
// Kriteria 4: Implementasi error handling dengan custom error class
// Digunakan ketika terjadi error validasi data atau pelanggaran business rule
// Mewarisi dari ClientError dengan status code 400 (Bad Request)
class InvariantError extends ClientError {
  // Constructor untuk InvariantError dengan message
  constructor(message) {
    // Panggil constructor parent class (ClientError) dengan status code 400
    super(message);
    // Set nama error untuk debugging dan logging
    this.name = "InvariantError";
  }
}

export default InvariantError;
