// shared/config/redis.ts
import "./dotenv-loader.ts";
import { createClient } from "redis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is missing in .env");
}

export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("connect", () => console.log("Redis connected - ✅"));
redis.on("error", (err: any) => console.error("Redis connection error:", err));

// Connect immediately
redis.connect();
