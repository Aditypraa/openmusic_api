// Export Validator for OpenMusic API v3
import InvariantError from "../../exceptions/InvariantError.js";
import { ExportPlaylistPayloadSchema } from "./schema.js";

const ExportsValidator = {
  validateExportPayload: (payload) => {
    const validationResult = ExportPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default ExportsValidator;
