import mongoose, { Schema, Document, Types } from "mongoose";
import { string } from "zod/v4";

export interface IUser extends Document {
  _id: Types.ObjectId;
  discordId?: string;
  // GitHub OAuth fields
  githubId?: string;
  githubAccessToken?: string;
  githubRefreshToken?: string;
  username: string;
  email?: string;
  fullname?: string;
  avatar?: string;
  
  // Discord specific fields
  globalName?: string;
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
  authProvider: 'discord' | 'github';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  // Discord OAuth fields
  globalName: { type: String },
  email: { type: String, unique: true },
  discordId: { type: String, sparse: true },
  
  // GitHub OAuth fields
  githubId: { type: String, sparse: true },
  githubAccessToken: { type: String },
  githubRefreshToken: { type: String },
  
  // Common fields
  username: { type: String, required: true },
  fullname: { type: String },
  avatar: { type: String },
  
  // Discord specific fields
  globalName: { type: String },
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
  authProvider: { type: String, enum: ['discord', 'github'], required: true },
  lastLoginAt: { type: Date },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// Indexes for better performance
UserSchema.index({ discordId: 1 }, { sparse: true });
UserSchema.index({ githubId: 1 }, { sparse: true });
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

// Ensure either discordId or githubId is present
UserSchema.pre('save', function() {
  if (!this.discordId && !this.githubId) {
    throw new Error('User must have either discordId or githubId');
  }
});

export const User = mongoose.model<IUser>("User", UserSchema);
