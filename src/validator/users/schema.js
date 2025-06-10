// Schema validasi untuk data user
import Joi from "joi";

const UserPayloadSchema = Joi.object({
  username: Joi.string().max(50).required().messages({
    "any.required": "Username harus diisi",
    "string.empty": "Username tidak boleh kosong",
    "string.max": "Username tidak boleh lebih dari 50 karakter"
}),
  password: Joi.string().required().messages({
    "any.required": "Password harus diisi",
    "string.empty": "Password tidak boleh kosong",
  }),
  fullname: Joi.string().required().messages({
    "any.required": "Fullname harus diisi",
    "string.empty": "Fullname tidak boleh kosong",
  }),
});

export default UserPayloadSchema;
