// Database configuration for Export Service
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "PGUSER",
  "PGHOST",
  "PGDATABASE",
  "PGPASSWORD",
  "PGPORT",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: String(process.env.PGPASSWORD), // Ensure password is a string
  port: parseInt(process.env.PGPORT),
});

// Test connection on startup
pool.on("connect", () => {
  console.log("✅ Export Service connected to database");
});

pool.on("error", (err) => {
  console.error("❌ Database connection error:", err);
});

export default pool;
