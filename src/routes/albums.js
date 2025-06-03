import AlbumsHandler from "../handlers/AlbumsHandler.js";
import AlbumsService from "../services/AlbumsService.js";
import AlbumsValidator from "../validator/albums/index.js";

const albumsService = new AlbumsService();
const albumsHandler = new AlbumsHandler(albumsService, AlbumsValidator);

const albumsRoutes = [
  {
    method: "POST",
    path: "/albums",
    handler: albumsHandler.postAlbumHandler,
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: albumsHandler.getAlbumByIdHandler,
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: albumsHandler.putAlbumByIdHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: albumsHandler.deleteAlbumByIdHandler,
  },
];

export default albumsRoutes;
