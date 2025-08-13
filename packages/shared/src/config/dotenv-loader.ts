import path from "path";
import { fileURLToPath } from "url";
import { config as configDotenv } from "dotenv";

// Recreate __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load your .env file from the root (going up from packages/shared/src/config)
configDotenv({ path: path.resolve(__dirname, "../../../../.env") });
