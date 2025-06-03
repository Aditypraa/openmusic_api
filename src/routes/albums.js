// Import dependencies untuk konfigurasi routes albums
import AlbumsHandler from "../handlers/AlbumsHandler.js"; // Handler untuk menangani request albums
import AlbumsService from "../services/AlbumsService.js"; // Service untuk business logic albums
import AlbumsValidator from "../validator/albums/index.js"; // Validator untuk validasi data albums

// Inisialisasi service dan handler dengan dependency injection
const albumsService = new AlbumsService();
const albumsHandler = new AlbumsHandler(albumsService, AlbumsValidator);

// Konfigurasi routing untuk endpoint albums
// Mengatur mapping antara HTTP method, path, dan handler function
const albumsRoutes = [
  {
    // POST /albums - Endpoint untuk menambahkan album baru
    method: "POST",
    path: "/albums",
    handler: albumsHandler.postAlbumHandler,
  },
  {
    // GET /albums/{id} - Endpoint untuk mendapatkan album berdasarkan ID
    // Termasuk optional feature untuk menampilkan songs dalam album
    method: "GET",
    path: "/albums/{id}",
    handler: albumsHandler.getAlbumByIdHandler,
  },
  {
    // PUT /albums/{id} - Endpoint untuk mengupdate data album berdasarkan ID
    method: "PUT",
    path: "/albums/{id}",
    handler: albumsHandler.putAlbumByIdHandler,
  },
  {
    // DELETE /albums/{id} - Endpoint untuk menghapus album berdasarkan ID
    method: "DELETE",
    path: "/albums/{id}",
    handler: albumsHandler.deleteAlbumByIdHandler,
  },
];

export default albumsRoutes;
