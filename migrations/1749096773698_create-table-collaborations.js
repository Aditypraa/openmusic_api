export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("collaborations", {
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
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("collaborations", "unique_playlist_user", {
    unique: ["playlist_id", "user_id"],
  });

  pgm.createIndex("collaborations", "playlist_id");
  pgm.createIndex("collaborations", "user_id");
};

export const down = (pgm) => {
  pgm.dropTable("collaborations");
};
