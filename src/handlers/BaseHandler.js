// Base Handler - Shared functionality for all handlers
import ClientError from "../exceptions/ClientError.js";

class BaseHandler {
  // Standardized success response helper
  _createSuccessResponse(h, data = null, message = null, statusCode = 200) {
    const response = {
      status: "success",
    };

    if (message) response.message = message;
    if (data) response.data = data;

    const httpResponse = h.response(response);
    httpResponse.code(statusCode);
    return httpResponse;
  }

  // Standardized error handling
  _handleError(error, h) {
    if (error instanceof ClientError) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }

    // Server error
    const response = h.response({
      status: "error",
      message: "Maaf, terjadi kegagalan pada server kami.",
    });
    response.code(500);
    console.error(error);
    return response;
  }
}

export default BaseHandler;
