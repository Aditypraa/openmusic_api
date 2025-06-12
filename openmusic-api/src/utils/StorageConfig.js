// Storage Configuration for OpenMusic API v3
// This file allows easy switching between Local Storage and S3 Storage

import LocalStorageService from "./localStorage/LocalStorageService.js";
import S3StorageService from "./S3/S3StorageService.js";

// Configuration options
const STORAGE_TYPES = {
  LOCAL: "local",
  S3: "s3",
};

// Get storage type from environment variable or default to local
const getStorageType = () => {
  const storageType =
    process.env.STORAGE_TYPE?.toLowerCase() || STORAGE_TYPES.LOCAL;

  // Validate storage type
  if (!Object.values(STORAGE_TYPES).includes(storageType)) {
    console.warn(
      `Invalid STORAGE_TYPE: ${storageType}. Defaulting to local storage.`
    );
    return STORAGE_TYPES.LOCAL;
  }

  return storageType;
};

// Factory function to create appropriate storage service
const createStorageService = () => {
  const storageType = getStorageType();

  switch (storageType) {
    case STORAGE_TYPES.S3: {
      console.log("🚀 Using S3 Storage Service");
      // Validate S3 configuration
      const requiredS3Vars = [
        "AWS_BUCKET_NAME",
        "AWS_REGION",
        "AWS_ACCESS_KEY_ID",
        "AWS_SECRET_ACCESS_KEY",
      ];
      const missingVars = requiredS3Vars.filter(
        (varName) => !process.env[varName]
      );

      if (missingVars.length > 0) {
        console.error(
          `❌ Missing S3 environment variables: ${missingVars.join(", ")}`
        );
        console.error("🔄 Falling back to Local Storage");
        return new LocalStorageService();
      }

      return new S3StorageService();
    }

    case STORAGE_TYPES.LOCAL:
    default:
      console.log("📁 Using Local Storage Service");
      return new LocalStorageService();
  }
};

export { STORAGE_TYPES, createStorageService };
export default createStorageService;
