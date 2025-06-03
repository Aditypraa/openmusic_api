import SongsHandler from "../handlers/SongsHandler.js";
import SongsService from "../services/SongsService.js";
import SongsValidator from "../validator/songs/index.js";

const songsService = new SongsService();
const songsHandler = new SongsHandler(songsService, SongsValidator);

const songsRoutes = [
  {
    method: "POST",
    path: "/songs",
    handler: songsHandler.postSongHandler,
  },
  {
    method: "GET",
    path: "/songs",
    handler: songsHandler.getSongsHandler,
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: songsHandler.getSongByIdHandler,
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: songsHandler.putSongByIdHandler,
  },
  {
    method: "DELETE",
    path: "/songs/{id}",
    handler: songsHandler.deleteSongByIdHandler,
  },
];

export default songsRoutes;
