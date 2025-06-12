// Storage Service - Local File System implementation
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StorageService {
  constructor(folder = "uploads") {
    this._folder = folder;

    // Build base URL dynamically from HOST and PORT env variables
    const host = process.env.HOST || "localhost";
    const port = process.env.PORT || 5000;
    this._baseUrl = `http://${host}:${port}`;

    // Create uploads directory if it doesn't exist (at openmusic-api level)
    const uploadsPath = path.resolve(__dirname, `../../../${folder}`);
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
      console.log(`📁 Created uploads directory: ${uploadsPath}`);
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const filepath = path.resolve(
      __dirname,
      `../../../${this._folder}/${filename}`
    );

    const fileStream = fs.createWriteStream(filepath);

    return new Promise((resolve, reject) => {
      fileStream.on("error", (error) => reject(error));
      file.pipe(fileStream);
      file.on("end", () => resolve(filename));
    });
  }

  generateUrl(filename) {
    return `${this._baseUrl}/${this._folder}/${filename}`;
  }

  deleteFile(filename) {
    const filePath = path.resolve(
      __dirname,
      `../../../${this._folder}/${filename}`
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export default StorageService;
