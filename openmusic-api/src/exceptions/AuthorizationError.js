// AuthorizationError class for handling authorization failures
// Extends ClientError to provide specific HTTP status code for authorization errors

import ClientError from "./ClientError.js";

class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403); // HTTP 403 Forbidden status code
    this.name = "AuthorizationError";
  }
}

export default AuthorizationError;
