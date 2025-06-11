// S3 Storage Service for OpenMusic API v3
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class S3StorageService {
  constructor() {
    this._S3 = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });
    this._bucketName = process.env.AWS_BUCKET_NAME;
  }

  async writeFile(file, meta) {
    const parameter = {
      Bucket: this._bucketName,
      Key: +new Date() + meta.filename,
      Body: file._data,
      ContentType: meta.headers["content-type"],
    };

    const command = new PutObjectCommand(parameter);
    await this._S3.send(command);
    return this.generateUrl(parameter.Key);
  }

  generateUrl(filename) {
    return `https://${this._bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
  }

  async generatePresignedUrl(filename, expiresIn = 3600) {
    const command = new PutObjectCommand({
      Bucket: this._bucketName,
      Key: filename,
    });
    return await getSignedUrl(this._S3, command, { expiresIn });
  }

  async deleteFile(filename) {
    const parameter = {
      Bucket: this._bucketName,
      Key: filename,
    };

    const command = new DeleteObjectCommand(parameter);
    return await this._S3.send(command);
  }
}

export default S3StorageService;
