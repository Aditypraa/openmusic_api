// ClientError - Base class untuk semua client error (4xx HTTP status codes)
// Kriteria 4: Implementasi error handling dengan custom error hierarchy
// Class ini menjadi parent untuk semua error yang disebabkan oleh client
// seperti validasi error, resource not found, unauthorized, dll.
class ClientError extends Error {
  // Constructor untuk ClientError dengan message dan statusCode
  constructor(message, statusCode = 400) {
    // Panggil constructor parent class (Error) dengan message
    super(message);

    // Set HTTP status code untuk response
    this.statusCode = statusCode;

    // Set nama error untuk debugging dan logging
    this.name = "ClientError";
  }
}

export default ClientError;
