// Export Service for OpenMusic API v3
import producerService from "../utils/ProducerService.js";

class ExportsService {
  constructor(playlistsService) {
    this._playlistsService = playlistsService;
  }

  async exportPlaylist(playlistId, targetEmail, userId) {
    // Verify user has access to playlist (owner or collaborator)
    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      playlistId,
      targetEmail,
    };

    await producerService.sendMessage(
      "export:playlist",
      JSON.stringify(message)
    );
  }
}

export default ExportsService;
