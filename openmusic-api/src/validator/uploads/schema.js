// Upload Validation Schema for OpenMusic API v3
import Joi from "joi";

const ImageHeadersSchema = Joi.object({
  "content-type": Joi.string()
    .valid(
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp"
    )
    .required(),
}).unknown();

export { ImageHeadersSchema };
