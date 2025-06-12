// Album Likes Handler for OpenMusic API v3
import BaseHandler from "./BaseHandler.js";

class AlbumLikesHandler extends BaseHandler {
  constructor(service) {
    super();
    this._service = service;

    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
  }

  async postAlbumLikeHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const { id: userId } = request.auth.credentials;

      await this._service.addLike(userId, albumId);

      return this._createSuccessResponse(
        h,
        null,
        "Berhasil menyukai album",
        201
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  async deleteAlbumLikeHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const { id: userId } = request.auth.credentials;

      await this._service.removeLike(userId, albumId);

      return this._createSuccessResponse(
        h,
        null,
        "Berhasil batal menyukai album"
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  async getAlbumLikesHandler(request, h) {
    try {
      const { id: albumId } = request.params;

      const { likes, source } = await this._service.getLikesCount(albumId);

      const response = this._createSuccessResponse(h, { likes });

      // Add custom header if data comes from cache
      if (source === "cache") {
        response.header("X-Data-Source", "cache");
      }

      return response;
    } catch (error) {
      return this._handleError(error, h);
    }
  }
}

export default AlbumLikesHandler;
