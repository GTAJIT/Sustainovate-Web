import path from "path";
import { fileURLToPath } from "url";
import { config as configDotenv } from "dotenv";

// Recreate __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load your .env
configDotenv({ path: path.resolve(__dirname, "../../.env") });
