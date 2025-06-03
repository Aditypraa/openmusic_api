// Import dependencies untuk konfigurasi routes songs
import SongsHandler from "../handlers/SongsHandler.js"; // Handler untuk menangani request songs
import SongsService from "../services/SongsService.js"; // Service untuk business logic songs
import SongsValidator from "../validator/songs/index.js"; // Validator untuk validasi data songs

// Inisialisasi service dan handler dengan dependency injection
const songsService = new SongsService();
const songsHandler = new SongsHandler(songsService, SongsValidator);

// Konfigurasi routing untuk endpoint songs
// Mengatur mapping antara HTTP method, path, dan handler function
// Termasuk optional feature untuk search songs berdasarkan query parameter
const songsRoutes = [
  {
    // POST /songs - Endpoint untuk menambahkan song baru
    method: "POST",
    path: "/songs",
    handler: songsHandler.postSongHandler,
  },
  {
    // GET /songs - Endpoint untuk mendapatkan daftar songs
    // Mendukung optional query parameter: title dan performer untuk search
    method: "GET",
    path: "/songs",
    handler: songsHandler.getSongsHandler,
  },
  {
    // GET /songs/{id} - Endpoint untuk mendapatkan song berdasarkan ID
    method: "GET",
    path: "/songs/{id}",
    handler: songsHandler.getSongByIdHandler,
  },
  {
    // PUT /songs/{id} - Endpoint untuk mengupdate data song berdasarkan ID
    method: "PUT",
    path: "/songs/{id}",
    handler: songsHandler.putSongByIdHandler,
  },
  {
    // DELETE /songs/{id} - Endpoint untuk menghapus song berdasarkan ID
    method: "DELETE",
    path: "/songs/{id}",
    handler: songsHandler.deleteSongByIdHandler,
  },
];

export default songsRoutes;
