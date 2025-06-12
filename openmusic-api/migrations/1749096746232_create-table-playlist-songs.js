export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("playlist_songs", {
    id: {
      type: "SERIAL",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"playlists"',
      onDelete: "CASCADE",
    },
    song_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"songs"',
      onDelete: "CASCADE",
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("playlist_songs", "unique_playlist_song", {
    unique: ["playlist_id", "song_id"],
  });

  pgm.createIndex("playlist_songs", "playlist_id");
  pgm.createIndex("playlist_songs", "song_id");
};

export const down = (pgm) => {
  pgm.dropTable("playlist_songs");
};
