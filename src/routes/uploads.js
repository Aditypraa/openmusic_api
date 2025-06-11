// Upload Routes for OpenMusic API v3
const uploadsRoutes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: (request, h) => handler.postUploadImageHandler(request, h),
    options: {
      payload: {
        maxBytes: 512000, // 512KB limit
        multipart: true,
        output: "stream",
        allow: "multipart/form-data",
        parse: true,
        failAction: (request, h, err) => {
          // Log the error to understand what we're getting
          console.error("Payload error in route:", {
            message: err.message,
            statusCode: err.output?.statusCode,
            isBoom: err.isBoom,
            type: typeof err,
            constructor: err.constructor.name,
          });

          // Handle payload too large error - be more comprehensive
          if (
            (err.output && err.output.statusCode === 413) ||
            (err.message &&
              err.message.includes(
                "Payload content length greater than maximum allowed"
              )) ||
            (err.message && err.message.includes("maxBytes")) ||
            (err.message &&
              err.message.toLowerCase().includes("payload too large")) ||
            (err.isBoom && err.output && err.output.statusCode === 413)
          ) {
            return h
              .response({
                status: "fail",
                message: "Payload too large",
              })
              .code(413)
              .header("Content-Type", "application/json")
              .takeover();
          }

          // If it's any other payload-related error, also return fail status
          if (err.message && err.message.toLowerCase().includes("payload")) {
            console.error("Other payload error:", err.message);
            return h
              .response({
                status: "fail",
                message: "Invalid payload",
              })
              .code(400)
              .header("Content-Type", "application/json")
              .takeover();
          }

          // For other errors, let them bubble up to the handler
          throw err;
        },
      },
    },
  },
];

export default uploadsRoutes;
