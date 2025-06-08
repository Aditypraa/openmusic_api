// Schema validasi untuk playlist
import Joi from "joi";

const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name harus diisi",
    "string.empty": "Name tidak boleh kosong",
  }),
});

const PostPlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required().messages({
    "any.required": "Song ID harus diisi",
    "string.empty": "Song ID tidak boleh kosong",
  }),
});

const DeletePlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required().messages({
    "any.required": "Song ID harus diisi",
    "string.empty": "Song ID tidak boleh kosong",
  }),
});

export default {
  PostPlaylistPayloadSchema,
  PostPlaylistSongPayloadSchema,
  DeletePlaylistSongPayloadSchema,
};
