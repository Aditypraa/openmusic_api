// Migration untuk membuat tabel songs
// Kriteria 5: Menggunakan PostgreSQL dengan database migration
// Kriteria Optional: Implementasi relasi antara albums dan songs
// File migration ini menggunakan node-pg-migrate untuk membuat tabel songs
// dengan struktur yang sesuai dan foreign key constraint ke tabel albums

// Function untuk menjalankan migration (membuat tabel songs)
export const up = (pgm) => {
  pgm.createTable("songs", {
    // Primary key: id dengan format "song-{nanoid}"
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    // Judul lagu - required field
    title: {
      type: "TEXT",
      notNull: true,
    },
    // Tahun rilis lagu - required field
    year: {
      type: "INTEGER",
      notNull: true,
    },
    // Performer/penyanyi lagu - required field
    performer: {
      type: "TEXT",
      notNull: true,
    },
    // Genre lagu - required field
    genre: {
      type: "TEXT",
      notNull: true,
    },
    // Durasi lagu dalam detik - optional field
    duration: {
      type: "INTEGER",
    },
    // Foreign key ke tabel albums - optional field
    // Null jika lagu tidak terkait dengan album tertentu
    album_id: {
      type: "VARCHAR(50)",
    },
    // Timestamp kapan record dibuat
    created_at: {
      type: "TEXT",
      notNull: true,
    },
    // Timestamp kapan record terakhir diupdate
    updated_at: {
      type: "TEXT",
      notNull: true,
    },
  });

  // Tambahkan foreign key constraint untuk menjaga referential integrity
  // ON DELETE CASCADE: jika album dihapus, semua lagu dalam album juga dihapus
  pgm.addConstraint(
    "songs",
    "fk_songs.album_id_albums.id",
    "FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE"
  );
};

// Function untuk rollback migration (menghapus tabel songs)
export const down = (pgm) => {
  pgm.dropTable("songs");
};
