/* eslint-disable no-console */
import mongoose from "mongoose";
import { config } from "dotenv";
config();

import User from "../src/modules/user/modle"; // adjust path if needed

async function migratePoints() {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);

    // Find users missing 'points' or missing 'authProviders'
    const users = await User.find({
      $or: [
        { points: { $exists: false } },
        { authProviders: { $exists: false } },
        { authProviders: { $size: 0 } },
      ],
    });

    for (const user of users) {
      if (user.points === undefined) {
        user.points = 0; // initialize points
      }
      await user.save();
      console.log(`✅ Migrated points for user: ${user.email || user.username}`);
    }

    console.log("🎉 Points migration completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migratePoints();
