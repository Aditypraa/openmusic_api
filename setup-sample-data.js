import pool from "./src/utils/database.js";
import { nanoid } from "nanoid";

async function setupSampleData() {
  const client = await pool.connect();

  try {
    console.log("🚀 Setting up sample data...");

    // Create sample album
    const albumId = `album-${nanoid(16)}`;
    const albumCreatedAt = new Date().toISOString();

    await client.query(
      "INSERT INTO albums (id, name, year, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)",
      [albumId, "Viva la Vida", 2008, albumCreatedAt, albumCreatedAt]
    );
    console.log("✅ Sample album created:", albumId);

    // Create sample songs
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

    for (const song of songs) {
      const songId = `song-${nanoid(16)}`;
      const songCreatedAt = new Date().toISOString();

      await client.query(
        "INSERT INTO songs (id, title, year, performer, genre, duration, album_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        [
          songId,
          song.title,
          song.year,
          song.performer,
          song.genre,
          song.duration,
          albumId,
          songCreatedAt,
          songCreatedAt,
        ]
      );
      console.log("✅ Sample song created:", song.title);
    }

    console.log("🎉 Sample data setup completed!");
    console.log(`📖 Album ID: ${albumId}`);
  } catch (error) {
    console.error("❌ Error setting up sample data:", error);
  } finally {
    client.release();
    pool.end();
  }
}

setupSampleData();
