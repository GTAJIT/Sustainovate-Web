/* eslint-disable no-console */
import mongoose from "mongoose";
import { config } from "dotenv";

config();
import User from "../src/modules/user/modle"; // <-- adjust path if needed

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);

    const users = await User.find({
      $or: [{ authProviders: { $exists: false } }, { authProviders: { $size: 0 } }],
    });

    for (const user of users) {
      user.authProviders = [{ provider: "custom", providerId: user._id.toString() }];
      await user.save();
      console.log(`✅ Migrated user: ${user.email}`);
    }

    console.log("🎉 Migration completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrateUsers();
