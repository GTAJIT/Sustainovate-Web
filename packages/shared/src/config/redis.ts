// shared/config/redis.ts
import "./dotenv-loader.js";
import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export const redis = createClient({
  url: redisUrl,
});

redis.on("connect", () => console.log("Redis connected - ✅"));
redis.on("error", (err: any) => {
  console.error("Redis connection error:", err);
  // Don't throw in development, just log
  if (process.env.NODE_ENV === 'production') {
    throw err;
  }
});

// Connect immediately
redis.connect().catch((err) => {
  console.error("Failed to connect to Redis:", err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});
