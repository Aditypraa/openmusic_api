// Import database connection pool dan nanoid untuk generate ID
import pool from "./src/utils/database.js";
import { nanoid } from "nanoid";

// Function untuk setup data sample ke database
async function setupSampleData() {
  // Ambil connection dari pool
  const client = await pool.connect();

  try {
    console.log("🚀 Setting up sample data...");

    // Generate ID unik untuk album sample
    const albumId = `album-${nanoid(16)}`;
    const albumCreatedAt = new Date().toISOString();

    // Insert album sample ke database
    await client.query(
      "INSERT INTO albums (id, name, year, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
      [albumId, "Viva la Vida", 2008, albumCreatedAt, albumCreatedAt]
    );
    console.log("✅ Sample album created:", albumId);

    // Data songs sample yang akan diinsert
    const songs = [
      {
        title: "Life in Technicolor",
        year: 2008,
        genre: "Alternative Rock",
        performer: "Coldplay",
        duration: 120,
      },
      {
        title: "Cemeteries of London",
        year: 2008,
        genre: "Alternative Rock",
        performer: "Coldplay",
        duration: 180,
      },
      {
        title: "Lost!",
        year: 2008,
        genre: "Alternative Rock",
        performer: "Coldplay",
        duration: 200,
      },
    ];

    // Loop untuk insert setiap song ke database
    for (const song of songs) {
      // Generate ID unik untuk setiap song
      const songId = `song-${nanoid(16)}`;
      const songCreatedAt = new Date().toISOString();

      // Insert song ke database dengan relasi ke album
      await client.query(
        "INSERT INTO songs (id, title, year, performer, genre, duration, album_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          songId,
          song.title,
          song.year,
          song.performer,
          song.genre,
          song.duration,
          albumId, // Relasi ke album yang sudah dibuat
          songCreatedAt,
          songCreatedAt,
        ]
      );
      console.log("✅ Sample song created:", song.title);
    }

    console.log("🎉 Sample data setup completed!");
    console.log(`📖 Album ID: ${albumId}`);
  } catch (error) {
    // Handle error jika terjadi masalah saat setup data
    console.error("❌ Error setting up sample data:", error);
  } finally {
    // Release connection dan tutup pool
    client.release();
    pool.end();
  }
}

// Jalankan function setup sample data
setupSampleData();
