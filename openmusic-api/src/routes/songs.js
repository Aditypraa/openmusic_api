// Routes untuk operasi lagu
const routes = (handler) => [
  {
    method: "POST",
    path: "/songs",
    handler: (request, h) => handler.postSongHandler(request, h),
  },
  {
    method: "GET",
    path: "/songs",
    handler: (request, h) => handler.getSongsHandler(request, h),
  },
  {
    method: "GET",
    path: "/songs/{id}",
    handler: (request, h) => handler.getSongByIdHandler(request, h),
  },
  {
    method: "PUT",
    path: "/songs/{id}",
    handler: (request, h) => handler.putSongByIdHandler(request, h),
  },
  {
    // DELETE /songs/{id} - Endpoint untuk menghapus song berdasarkan ID
    method: "DELETE",
    path: "/songs/{id}",
    handler: (request, h) => handler.deleteSongByIdHandler(request, h),
  },
];

export default routes;
