// Schema validasi untuk autentikasi
import Joi from "joi";

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username harus diisi",
    "string.empty": "Username tidak boleh kosong",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password harus diisi",
    "string.empty": "Password tidak boleh kosong",
  }),
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token harus diisi",
    "string.empty": "Refresh token tidak boleh kosong",
  }),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token harus diisi",
    "string.empty": "Refresh token tidak boleh kosong",
  }),
});

export default {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
