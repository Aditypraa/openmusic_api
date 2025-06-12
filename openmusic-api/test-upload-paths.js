// Test Upload Path Resolution
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 Testing Upload Path Resolution...");

// Test LocalStorageService path
const localStoragePath = path.resolve(__dirname, "../../../uploads");
console.log("📁 LocalStorageService uploads path:", localStoragePath);
console.log("📁 Directory exists:", fs.existsSync(localStoragePath));

// Test server.js static path
const serverStaticPath = path.resolve(__dirname, "../../uploads");
console.log("🌐 Server static files path:", serverStaticPath);
console.log("🌐 Directory exists:", fs.existsSync(serverStaticPath));

// Create test file structure visualization
console.log("\n📊 Expected Directory Structure:");
console.log("openmusic_api/");
console.log("├── uploads/                  ← Upload files here");
console.log("├── openmusic-api/");
console.log("│   └── src/");
console.log(
  "│       ├── server.js         ← Static files serve from ../../uploads"
);
console.log("│       └── utils/");
console.log("│           └── localStorage/");
console.log(
  "│               └── LocalStorageService.js  ← Write files to ../../../uploads"
);
console.log("└── export-service/");

// Test path resolution
const uploadsFromSrc = path.resolve(__dirname, "../../uploads");
const uploadsFromLocalStorage = path.resolve(__dirname, "../../../uploads");

console.log("\n✅ Path Resolution Test:");
console.log(
  "From src/utils/localStorage/ to project uploads:",
  uploadsFromLocalStorage
);
console.log("From src/ to project uploads:", uploadsFromSrc);
console.log(
  "Paths match:",
  uploadsFromSrc === uploadsFromLocalStorage ? "✅ YES" : "❌ NO"
);
