// Import database connection pool
import pool from "./src/utils/database.js";

// Function untuk test koneksi database
async function testConnection() {
  try {
    // Coba ambil connection dari pool
    const client = await pool.connect();
    console.log("✅ Database connection successful!");

    // Test query sederhana untuk memastikan database berfungsi
    const result = await client.query("SELECT NOW()");
    console.log("✅ Database query successful:", result.rows[0]);

    // Release connection kembali ke pool
    client.release();
    // Tutup pool setelah test selesai
    pool.end();
  } catch (error) {
    // Handle error jika koneksi gagal
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Exit dengan error code
  }
}

// Jalankan test koneksi
testConnection();
