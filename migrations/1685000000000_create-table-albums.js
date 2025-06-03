// Migration untuk membuat tabel albums
// Kriteria 5: Menggunakan PostgreSQL dengan database migration
// File migration ini menggunakan node-pg-migrate untuk membuat tabel albums
// dengan struktur yang sesuai dan menyediakan rollback function

// Function untuk menjalankan migration (membuat tabel albums)
export const up = (pgm) => {
  pgm.createTable("albums", {
    // Primary key: id dengan format "album-{nanoid}"
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    // Nama album - required field
    name: {
      type: "TEXT",
      notNull: true,
    },
    // Tahun rilis album - required field
    year: {
      type: "INTEGER",
      notNull: true,
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
};

// Function untuk rollback migration (menghapus tabel albums)
export const down = (pgm) => {
  pgm.dropTable("albums");
};
