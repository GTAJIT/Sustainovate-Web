import mongoose, { Schema, Document, Types } from "mongoose";
import { string } from "zod/v4";

export interface IUser extends Document {
  _id: Types.ObjectId;
  discordId: string;
  username: string;
  globalName?: string;
  email?: string;
  avatar?: string;
  discriminator?: string;
  verified?: boolean;
  locale?: string;
  mfaEnabled?: boolean;
  premiumType?: number;
  publicFlags?: number;
  flags?: number;
  banner?: string;
  accentColor?: number;
  password: string;
  
  // Application specific fields
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  // Discord OAuth fields
  discordId: { type: String, unique: true },
  username: { type: String, required: true },
  globalName: { type: String },
  email: { type: String, unique: true },
  avatar: { type: String },
  discriminator: { type: String },
  verified: { type: Boolean, default: false },
  locale: { type: String },
  mfaEnabled: { type: Boolean, default: false },
  premiumType: { type: Number },
  publicFlags: { type: Number },
  flags: { type: Number },
  banner: { type: String },
  accentColor: { type: Number },
  password: {type: String, required: true},
  
  // Application fields
  role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Indexes for better performance
// UserSchema.index({ discordId: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
