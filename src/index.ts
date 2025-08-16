import http from "http";

import { config } from "dotenv";
config();

import app from "./app";
import logger from "./core/config/logger";
import { connectDB } from "./core/config/database";

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    // 🔹 Connect to MongoDB first
    await connectDB();

    // 🔹 Only start server if DB connection succeeds
    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

start();
