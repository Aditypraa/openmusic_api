import pool from "./src/utils/database.js";

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Database connection successful!");

    // Test query
    const result = await client.query("SELECT NOW()");
    console.log("✅ Database query successful:", result.rows[0]);

    client.release();
    pool.end();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
