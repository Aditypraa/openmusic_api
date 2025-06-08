// Validator untuk data kolaborasi
import InvariantError from "../../exceptions/InvariantError.js";
import schemas from "./schema.js";

const { PostCollaborationPayloadSchema, DeleteCollaborationPayloadSchema } =
  schemas;

const CollaborationsValidator = {
  validatePostCollaborationPayload: (payload) => {
    const validationResult = PostCollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteCollaborationPayload: (payload) => {
    const validationResult = DeleteCollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default CollaborationsValidator;
