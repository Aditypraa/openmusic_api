// Import dependencies untuk database connection
import { Pool } from "pg"; // PostgreSQL client library
import dotenv from "dotenv"; // Library untuk membaca environment variables

// Load environment variables dari file .env
dotenv.config();

// Database Connection Pool - PostgreSQL connection pool
// Kriteria 5: Menggunakan PostgreSQL sebagai database
// Connection pool digunakan untuk mengelola multiple koneksi database secara efisien
// Menghindari overhead membuat koneksi baru setiap request dan mengatur max connections
// Konfigurasi database diambil dari environment variables (.env file)
const pool = new Pool({
  user: process.env.PGUSER, // Username database
  host: process.env.PGHOST, // Host database (localhost untuk development)
  database: process.env.PGDATABASE, // Nama database
  password: process.env.PGPASSWORD, // Password database
  port: process.env.PGPORT, // Port database (default: 5432)
});

export default pool;
