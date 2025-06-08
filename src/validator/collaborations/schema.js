// Schema validasi untuk kolaborasi
import Joi from "joi";

const PostCollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required().messages({
    "any.required": "Playlist ID harus diisi",
    "string.empty": "Playlist ID tidak boleh kosong",
  }),
  userId: Joi.string().required().messages({
    "any.required": "User ID harus diisi",
    "string.empty": "User ID tidak boleh kosong",
  }),
});

const DeleteCollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required().messages({
    "any.required": "Playlist ID harus diisi",
    "string.empty": "Playlist ID tidak boleh kosong",
  }),
  userId: Joi.string().required().messages({
    "any.required": "User ID harus diisi",
    "string.empty": "User ID tidak boleh kosong",
  }),
});

export default {
  PostCollaborationPayloadSchema,
  DeleteCollaborationPayloadSchema,
};
