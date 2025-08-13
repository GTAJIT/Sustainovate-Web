import mongoose from "mongoose";
import "./dotenv-loader.js";

const mongoUrl = process.env.DATABASE_URL || "mongodb://localhost:27017/sustainovate";
if (!mongoUrl) {
  throw new Error("DATABASE_URL missing in .env");
}

export async function connectDB() {
  try {
    await mongoose.connect(mongoUrl); // <-- non-null assertion here
    console.log("MongoDB connected - ✅");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
