// Handler untuk operasi playlist dengan autentikasi
import BaseHandler from "./BaseHandler.js";

class PlaylistsHandler extends BaseHandler {
  constructor(service, validator) {
    super();
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deleteSongFromPlaylistHandler =
      this.deleteSongFromPlaylistHandler.bind(this);
    this.getPlaylistActivitiesHandler =
      this.getPlaylistActivitiesHandler.bind(this);
  }

  // POST /playlists - buat playlist baru
  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload);

      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.addPlaylist({
        name,
        owner: credentialId,
      });

      return this._createSuccessResponse(
        h,
        { playlistId },
        "Playlist berhasil ditambahkan",
        201
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // GET /playlists - ambil semua playlist user
  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._service.getPlaylists(credentialId);

      return this._createSuccessResponse(h, { playlists });
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // DELETE /playlists/{id} - hapus playlist
  async deletePlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      // Verifikasi kepemilikan playlist
      await this._service.verifyPlaylistOwner(id, credentialId);

      await this._service.deletePlaylistById(id);

      return this._createSuccessResponse(h, null, "Playlist berhasil dihapus");
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // POST /playlists/{id}/songs - tambah lagu ke playlist
  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistSongPayload(request.payload);

      const { songId } = request.payload;
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      // Verifikasi akses playlist (owner atau kolaborator)
      await this._service.verifyPlaylistAccess(id, credentialId);

      await this._service.addSongToPlaylist(id, songId);

      // Catat aktivitas
      await this._service.addActivity(id, songId, credentialId, "add");

      return this._createSuccessResponse(
        h,
        null,
        "Lagu berhasil ditambahkan ke playlist",
        201
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // GET /playlists/{id}/songs - ambil lagu dalam playlist
  async getPlaylistSongsHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      // Verifikasi akses playlist
      await this._service.verifyPlaylistAccess(id, credentialId);

      // Retrieve playlist info and its songs
      const { playlist: playlistInfo, songs } =
        await this._service.getPlaylistSongs(id);
      // Structure response to match expected schema
      return this._createSuccessResponse(h, {
        playlist: {
          id: playlistInfo.id,
          name: playlistInfo.name,
          username: playlistInfo.username,
          songs,
        },
      });
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // DELETE /playlists/{id}/songs - hapus lagu dari playlist
  async deleteSongFromPlaylistHandler(request, h) {
    try {
      this._validator.validateDeletePlaylistSongPayload(request.payload);

      const { songId } = request.payload;
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      // Verifikasi akses playlist
      await this._service.verifyPlaylistAccess(id, credentialId);

      await this._service.deleteSongFromPlaylist(id, songId);

      // Catat aktivitas
      await this._service.addActivity(id, songId, credentialId, "delete");

      return this._createSuccessResponse(
        h,
        null,
        "Lagu berhasil dihapus dari playlist"
      );
    } catch (error) {
      return this._handleError(error, h);
    }
  }

  // GET /playlists/{id}/activities - ambil aktivitas playlist
  async getPlaylistActivitiesHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      console.log(
        `Verifying ownership for playlist: ${id}, user: ${credentialId}`
      );
      await this._service.verifyPlaylistOwner(id, credentialId);

      console.log(`Fetching activities for playlist: ${id}`);
      const activities = await this._service.getPlaylistActivities(id);

      const formattedActivities = activities.map((activity) => ({
        username: activity.username,
        title: activity.title,
        action: activity.action,
        time: activity.time,
      }));

      console.log(`Activities fetched successfully for playlist: ${id}`);
      return this._createSuccessResponse(h, {
        playlistId: id,
        activities: formattedActivities,
      });
    } catch (error) {
      console.error(`Error in getPlaylistActivitiesHandler: ${error.message}`);
      return this._handleError(error, h);
    }
  }
}

export default PlaylistsHandler;
