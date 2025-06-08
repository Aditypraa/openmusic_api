// Server OpenMusic API v2
import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import dotenv from "dotenv";

// Import routes
import albumsRoutes from "./routes/albums.js";
import songsRoutes from "./routes/songs.js";
import usersRoutes from "./routes/users.js";
import authenticationsRoutes from "./routes/authentications.js";
import playlistsRoutes from "./routes/playlists.js";
import collaborationsRoutes from "./routes/collaborations.js";

// Import services
import pool from "./utils/database.js";
import AlbumsService from "./services/AlbumsService.js";
import SongsService from "./services/SongsService.js";
import UsersService from "./services/UsersService.js";
import AuthenticationsService from "./services/AuthenticationsService.js";
import PlaylistsService from "./services/PlaylistsService.js";
import CollaborationsService from "./services/CollaborationsService.js";

// Import handlers
import AlbumsHandler from "./handlers/AlbumsHandler.js";
import SongsHandler from "./handlers/SongsHandler.js";
import UsersHandler from "./handlers/UsersHandler.js";
import AuthenticationsHandler from "./handlers/AuthenticationsHandler.js";
import PlaylistsHandler from "./handlers/PlaylistsHandler.js";
import CollaborationsHandler from "./handlers/CollaborationsHandler.js";

// Import validators
import AlbumsValidator from "./validator/albums/index.js";
import SongsValidator from "./validator/songs/index.js";
import UsersValidator from "./validator/users/index.js";
import AuthenticationsValidator from "./validator/authentications/index.js";
import PlaylistsValidator from "./validator/playlists/index.js";
import CollaborationsValidator from "./validator/collaborations/index.js";

dotenv.config();

const init = async () => {
  // Initialize services
  const albumsService = new AlbumsService(pool);
  const songsService = new SongsService(pool);
  const usersService = new UsersService(pool);
  const authenticationsService = new AuthenticationsService(pool);
  const collaborationsService = new CollaborationsService(pool);
  const playlistsService = new PlaylistsService(pool, collaborationsService);

  // Initialize handlers
  const albumsHandler = new AlbumsHandler(albumsService, AlbumsValidator);
  const songsHandler = new SongsHandler(songsService, SongsValidator);
  const usersHandler = new UsersHandler(usersService, UsersValidator);
  const authenticationsHandler = new AuthenticationsHandler(
    authenticationsService,
    usersService,
    AuthenticationsValidator
  );
  const playlistsHandler = new PlaylistsHandler(
    playlistsService,
    PlaylistsValidator
  );
  const collaborationsHandler = new CollaborationsHandler(
    collaborationsService,
    playlistsService,
    usersService,
    CollaborationsValidator
  );

  // Konfigurasi server
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  // Register JWT plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // JWT authentication strategy
  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: parseInt(process.env.ACCESS_TOKEN_AGE) || 1800,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  // Register routes
  server.route(albumsRoutes(albumsHandler));
  server.route(songsRoutes(songsHandler));
  server.route(usersRoutes(usersHandler));
  server.route(authenticationsRoutes(authenticationsHandler));
  server.route(playlistsRoutes(playlistsHandler));
  server.route(collaborationsRoutes(collaborationsHandler));

  // Start server
  await server.start();
  console.log("OpenMusic API v2 running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
