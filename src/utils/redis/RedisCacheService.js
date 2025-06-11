// Redis Cache Service for OpenMusic API v3
import redis from "redis";

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER || "localhost",
        port: 6379,
      },
    });

    this._client.on("error", (error) => {
      console.error("Redis Client Error:", error);
    });

    this._client.on("connect", () => {
      console.log("✅ Connected to Redis");
    });
  }

  async connect() {
    await this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.setEx(key, expirationInSecond, value);
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error("Cache not found");
    return result;
  }

  async delete(key) {
    return this._client.del(key);
  }

  async quit() {
    return this._client.quit();
  }
}

export default CacheService;
