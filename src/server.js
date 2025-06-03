import Hapi from "@hapi/hapi";
import dotenv from "dotenv";
import albumsRoutes from "./routes/albums.js";
import songsRoutes from "./routes/songs.js";

// Load environment variables
dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // Register routes
  server.route(albumsRoutes);
  server.route(songsRoutes);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
