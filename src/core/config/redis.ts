/* eslint-disable no-console */
import { createClient, RedisClientType } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

let redis: RedisClientType | null = null;

export async function connectRedis() {
  try {
    if (!redis) {
      redis = createClient({ url: redisUrl });

      redis.on("connect", () => console.log("Redis connected - ✅"));
      redis.on("error", (err: unknown) => {
        console.error("Redis connection error:", err);
        if (process.env.NODE_ENV === "production") {
          throw err;
        }
      });

      await redis.connect();
    }
    return redis; // ✅ return client like mongoose connectDB
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return null;
  }
}
