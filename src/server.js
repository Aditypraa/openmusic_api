// Server OpenMusic API v3
import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import Inert from "@hapi/inert";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import albumsRoutes from "./routes/albums.js";
import songsRoutes from "./routes/songs.js";
import usersRoutes from "./routes/users.js";
import authenticationsRoutes from "./routes/authentications.js";
import playlistsRoutes from "./routes/playlists.js";
import collaborationsRoutes from "./routes/collaborations.js";
import exportsRoutes from "./routes/exports.js";
import uploadsRoutes from "./routes/uploads.js";

// Import services
import pool from "./utils/database.js";
import AlbumsService from "./services/AlbumsService.js";
import SongsService from "./services/SongsService.js";
import UsersService from "./services/UsersService.js";
import AuthenticationsService from "./services/AuthenticationsService.js";
import PlaylistsService from "./services/PlaylistsService.js";
import CollaborationsService from "./services/CollaborationsService.js";
import ExportsService from "./services/ExportsService.js";
import AlbumLikesService from "./services/AlbumLikesService.js";
import CacheService from "./utils/redis/RedisCacheService.js";
import createStorageService from "./utils/StorageConfig.js";

// Import handlers
import AlbumsHandler from "./handlers/AlbumsHandler.js";
import SongsHandler from "./handlers/SongsHandler.js";
import UsersHandler from "./handlers/UsersHandler.js";
import AuthenticationsHandler from "./handlers/AuthenticationsHandler.js";
import PlaylistsHandler from "./handlers/PlaylistsHandler.js";
import CollaborationsHandler from "./handlers/CollaborationsHandler.js";
import ExportsHandler from "./handlers/ExportsHandler.js";
import UploadsHandler from "./handlers/UploadsHandler.js";
import AlbumLikesHandler from "./handlers/AlbumLikesHandler.js";

// Import validators
import AlbumsValidator from "./validator/albums/index.js";
import SongsValidator from "./validator/songs/index.js";
import UsersValidator from "./validator/users/index.js";
import AuthenticationsValidator from "./validator/authentications/index.js";
import PlaylistsValidator from "./validator/playlists/index.js";
import CollaborationsValidator from "./validator/collaborations/index.js";
import ExportsValidator from "./validator/exports/index.js";
import UploadsValidator from "./validator/uploads/index.js";

dotenv.config();

const init = async () => {
  // Initialize cache service
  const cacheService = new CacheService();
  await cacheService.connect();
  // Initialize storage service
  const storageService = createStorageService();

  // Initialize services
  const albumsService = new AlbumsService(pool);
  const songsService = new SongsService(pool);
  const usersService = new UsersService(pool);
  const authenticationsService = new AuthenticationsService(pool);
  const collaborationsService = new CollaborationsService(pool);
  const playlistsService = new PlaylistsService(pool, collaborationsService);
  const exportsService = new ExportsService(playlistsService);
  const albumLikesService = new AlbumLikesService(pool, cacheService);

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
  const exportsHandler = new ExportsHandler(exportsService, ExportsValidator);
  const uploadsHandler = new UploadsHandler(
    storageService,
    albumsService,
    UploadsValidator
  );
  const albumLikesHandler = new AlbumLikesHandler(albumLikesService);
  // Konfigurasi server
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || "localhost",
    routes: {
      cors: {
        origin: ["*"],
      },
      files: {
        relativeTo: path.join(__dirname, "../uploads"),
      },
    },
  });

  // Register plugins
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // Static file serving for uploads
  server.route({
    method: "GET",
    path: "/uploads/{param*}",
    handler: {
      directory: {
        path: ".",
        redirectToSlash: true,
      },
    },
  });
  // Global error handling for payload size and other errors
  server.ext("onPreResponse", (request, h) => {
    const response = request.response;

    // Handle Boom errors (including payload size errors)
    if (response.isBoom) {
      console.error("Server error intercepted:", {
        statusCode: response.output.statusCode,
        message: response.message,
        payload: response.output.payload,
      });

      // Handle payload too large errors (413)
      if (response.output.statusCode === 413) {
        return h
          .response({
            status: "fail",
            message: "Payload too large",
          })
          .code(413)
          .header("Content-Type", "application/json");
      }

      // Handle other client errors (4xx)
      if (
        response.output.statusCode >= 400 &&
        response.output.statusCode < 500
      ) {
        return h
          .response({
            status: "fail",
            message: response.message || "Client error",
          })
          .code(response.output.statusCode)
          .header("Content-Type", "application/json");
      }

      // Handle server errors (5xx)
      if (response.output.statusCode >= 500) {
        return h
          .response({
            status: "error",
            message: "Maaf, terjadi kegagalan pada server kami.",
          })
          .code(500)
          .header("Content-Type", "application/json");
      }
    }

    return h.continue;
  });

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
  server.route(exportsRoutes(exportsHandler));
  server.route(uploadsRoutes(uploadsHandler));

  // Album likes routes
  server.route([
    {
      method: "POST",
      path: "/albums/{id}/likes",
      handler: (request, h) =>
        albumLikesHandler.postAlbumLikeHandler(request, h),
      options: {
        auth: "openmusic_jwt",
      },
    },
    {
      method: "DELETE",
      path: "/albums/{id}/likes",
      handler: (request, h) =>
        albumLikesHandler.deleteAlbumLikeHandler(request, h),
      options: {
        auth: "openmusic_jwt",
      },
    },
    {
      method: "GET",
      path: "/albums/{id}/likes",
      handler: (request, h) =>
        albumLikesHandler.getAlbumLikesHandler(request, h),
    },
  ]);

  // Start server
  await server.start();
  console.log("OpenMusic API v3 running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
