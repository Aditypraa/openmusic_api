// Migration: create table songs
export const up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
    performer: {
      type: "TEXT",
      notNull: true,
    },
    genre: {
      type: "TEXT",
      notNull: true,
    },
    duration: {
      type: "INTEGER",
    },
    album_id: {
      type: "VARCHAR(50)",
    },
    created_at: {
      type: "TEXT",
      notNull: true,
    },
    updated_at: {
      type: "TEXT",
      notNull: true,
    },
  });

  // Foreign key constraint dengan CASCADE delete
  pgm.addConstraint(
    "songs",
    "fk_songs.album_id_albums.id",
    "FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE"
  );
};

export const down = (pgm) => {
  pgm.dropTable("songs");
};
