// Exports Handler for OpenMusic API v3
import BaseHandler from "./BaseHandler.js";

class ExportsHandler extends BaseHandler {
  constructor(service, validator) {
    super();
    this._service = service;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    try {
      this._validator.validateExportPayload(request.payload);

      const { playlistId } = request.params;
      const { targetEmail } = request.payload;
      const { id: userId } = request.auth.credentials;

      await this._service.exportPlaylist(playlistId, targetEmail, userId);

      return this._createSuccessResponse(
        h,
        null,
        "Permintaan Anda sedang kami proses",
        201
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }
}

export default ExportsHandler;
