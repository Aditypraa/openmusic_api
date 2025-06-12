// Utility untuk operasi JWT token
import jwt from "jsonwebtoken";
import InvariantError from "../exceptions/InvariantError.js";

const TokenManager = {
  generateAccessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: `${process.env.ACCESS_TOKEN_AGE || 1800}s`,
    });
  },

  generateRefreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, {
      expiresIn: `${process.env.REFRESH_TOKEN_AGE || 86400}s`,
    });
  },

  verifyAccessToken: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      return decoded;
    } catch {
      throw new InvariantError("Access token tidak valid");
    }
  },

  verifyRefreshToken: (token) => {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      return decoded;
    } catch {
      throw new InvariantError("Refresh token tidak valid");
    }
  },
};

export default TokenManager;
