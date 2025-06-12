// Upload Handler for OpenMusic API v3
import BaseHandler from "./BaseHandler.js";

class UploadsHandler extends BaseHandler {
  constructor(storageService, albumsService, validator) {
    super();
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { cover } = request.payload;
      const { id } = request.params;

      // Check if cover file is provided
      if (!cover) {
        return this._createFailResponse(h, "Cover file is required", 400);
      }

      // Check if cover has headers (valid file upload)
      if (!cover.hapi || !cover.hapi.headers) {
        return this._createFailResponse(h, "Invalid file upload", 400);
      }

      // Validate image headers (MIME type)
      this._validator.validateImageHeaders(cover.hapi.headers);

      const filename = await this._storageService.writeFile(cover, cover.hapi);
      const coverUrl = this._storageService.generateUrl(filename);

      await this._albumsService.editAlbumCoverById(id, coverUrl);

      return this._createSuccessResponse(
        h,
        null,
        "Sampul berhasil diunggah",
        201
      );
    } catch (error) {
      // Log error for debugging
      console.error("UploadsHandler error:", {
        message: error.message,
        statusCode: error.statusCode,
        isBoom: error.isBoom,
        stack: error.stack,
      });

      // Check for payload size errors that might have slipped through
      if (
        error.message &&
        (error.message.includes(
          "Payload content length greater than maximum allowed"
        ) ||
          error.message.includes("maxBytes") ||
          error.message.toLowerCase().includes("payload too large"))
      ) {
        return this._createFailResponse(h, "Payload too large", 413);
      }

      return this._handleError(error, h);
    }
  }
}

export default UploadsHandler;
