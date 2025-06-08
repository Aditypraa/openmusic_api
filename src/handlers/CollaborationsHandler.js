// Handler untuk operasi kolaborasi playlist
import BaseHandler from "./BaseHandler.js";

class CollaborationsHandler extends BaseHandler {
  constructor(
    collaborationsService,
    playlistsService,
    usersService,
    validator
  ) {
    super();
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  // POST /collaborations - tambah kolaborator ke playlist
  async postCollaborationHandler(request, h) {
    try {
      this._validator.validatePostCollaborationPayload(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      // Verifikasi kepemilikan playlist (hanya owner bisa tambah kolaborator)
      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        credentialId
      );

      // Verifikasi bahwa user yang akan ditambahkan sebagai kolaborator ada
      await this._usersService.getUserById(userId);

      const collaborationId = String(
        await this._collaborationsService.addCollaboration(playlistId, userId)
      );

      return this._createSuccessResponse(
        h,
        { collaborationId },
        "Kolaborasi berhasil ditambahkan",
        201
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // DELETE /collaborations - hapus kolaborator dari playlist
  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateDeleteCollaborationPayload(request.payload);
      const { playlistId, userId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      // Verifikasi kepemilikan playlist (hanya owner bisa hapus kolaborator)
      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        credentialId
      );

      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return this._createSuccessResponse(
        h,
        null,
        "Kolaborasi berhasil dihapus"
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }
}

export default CollaborationsHandler;
