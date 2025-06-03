// Main server file untuk OpenMusic API menggunakan Hapi.js framework
// Mengatur konfigurasi server, CORS, dan routing untuk endpoints albums dan songs

import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import albumsRoutes from "./routes/albums.js";
import songsRoutes from "./routes/songs.js";

// Load environment variables dari file .env
dotenv.config();

// Fungsi inisialisasi server
const init = async () => {
  // Konfigurasi server Hapi dengan port, host, dan CORS
  const server = Hapi.server({
    port: process.env.PORT || 3000, // Port dari environment variable atau default 3000
    host: process.env.HOST || "localhost", // Host dari environment variable atau default localhost
    routes: {
      cors: {
        origin: ["*"], // Enable CORS untuk semua origin
      },
    },
  });

  // Register routes untuk albums dan songs
  server.route(albumsRoutes);
  server.route(songsRoutes);

  // Start server dan tampilkan URL
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

// Error handling untuk unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

// Jalankan inisialisasi server
init();
