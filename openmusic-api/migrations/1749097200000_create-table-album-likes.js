// Migration: create table album_likes
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable("album_likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    album_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  // Foreign key constraints
  pgm.addConstraint(
    "album_likes",
    "fk_album_likes.user_id_users.id",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "album_likes",
    "fk_album_likes.album_id_albums.id",
    "FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE"
  );

  // Unique constraint to prevent duplicate likes
  pgm.addConstraint(
    "album_likes",
    "unique_user_album_like",
    "UNIQUE(user_id, album_id)"
  );
};

export const down = (pgm) => {
  pgm.dropTable("album_likes");
};
