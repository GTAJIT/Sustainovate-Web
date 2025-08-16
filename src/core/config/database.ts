/* eslint-disable no-console */
// src/core/config/database.ts
import { config } from "dotenv";
config();
import mongoose from "mongoose";

const mongoUrl = process.env.DATABASE_URL || "abcdefg";

export async function connectDB() {
  try {
    if (mongoUrl.startsWith("mongodb://") || mongoUrl.startsWith("mongodb+srv://")) {
      const connection = await mongoose.connect(mongoUrl, {
        dbName: "sustainovate",
        serverSelectionTimeoutMS: 5000,
      });
      console.log("MongoDB connected - ✅");
      return connection; // ✅ return something
    } else {
      console.warn("No valid MongoDB URI found, skipping database connection");
      return null; // ✅ explicit return
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return null;
  }
}
