// Export Validation Schema for OpenMusic API v3
import Joi from "joi";

const ExportPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

export { ExportPlaylistPayloadSchema };
