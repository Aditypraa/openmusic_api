// S3 Storage Service for OpenMusic API v3
import AWS from "aws-sdk";

class S3StorageService {
  constructor() {
    this._S3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    this._bucketName = process.env.AWS_BUCKET_NAME;
  }

  writeFile(file, meta) {
    const parameter = {
      Bucket: this._bucketName,
      Key: +new Date() + meta.filename,
      Body: file._data,
      ContentType: meta.headers["content-type"],
    };

    return new Promise((resolve, reject) => {
      this._S3.upload(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data.Location);
      });
    });
  }

  generateUrl(filename) {
    return `https://${this._bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
  }

  deleteFile(filename) {
    const parameter = {
      Bucket: this._bucketName,
      Key: filename,
    };

    return new Promise((resolve, reject) => {
      this._S3.deleteObject(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data);
      });
    });
  }
}

export default S3StorageService;
