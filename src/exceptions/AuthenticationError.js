// AuthenticationError class for handling authentication failures
// Extends ClientError to provide specific HTTP status code for auth errors

import ClientError from "./ClientError.js";

class AuthenticationError extends ClientError {
  constructor(message) {
    super(message, 401); // HTTP 401 Unauthorized status code
    this.name = "AuthenticationError";
  }
}

export default AuthenticationError;
