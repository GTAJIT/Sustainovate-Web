import { Schema, Types, model, models, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Subdocument for authentication providers
interface IAuthProvider {
  provider: "google" | "github" | "discord" | "custom";
  providerId?: string; // OAuth ID (sub, id, etc.)
  accessToken?: string;
  refreshToken?: string;
}

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password?: string; // still supported for custom auth
  authProviders: IAuthProvider[];

  // Profile
  globalName?: string;
  avatar?: string;
  discriminator?: string;
  verified: boolean;
  locale?: string;
  mfaEnabled: boolean;
  premiumType?: number;
  publicFlags?: number;
  flags?: number;
  banner?: string;
  accentColor?: number;

  // App-level
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  lastLoginAt?: Date;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserModel = Model<IUser, object, IUserMethods>;

const AuthProviderSchema = new Schema<IAuthProvider>(
  {
    provider: {
      type: String,
      enum: ["google", "github", "discord", "custom"],
      required: true,
    },
    providerId: { type: String },
    accessToken: { type: String },
    refreshToken: { type: String },
  },
  { _id: false },
);

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },

    // Password only used for "custom" provider
    password: { type: String, required: true, select: false },

    // Auth providers (google, github, discord, custom)
    authProviders: {
      type: [AuthProviderSchema],
      validate: {
        validator: (v: IAuthProvider[]) => v.length > 0,
        message: "User must have at least one authentication provider",
      },
    },

    // Profile
    globalName: String,
    avatar: String,
    discriminator: String,
    verified: { type: Boolean, default: false },
    locale: { type: String, default: "en" },
    mfaEnabled: { type: Boolean, default: false },
    premiumType: { type: Number, default: 0 },
    publicFlags: { type: Number, default: 0 },
    flags: { type: Number, default: 0 },
    banner: String,
    accentColor: { type: Number, default: 0 },

    // App-level
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
    points: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

// Hash password only if present (for "custom" auth)
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes for fast lookups
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ "authProviders.providerId": 1 });
UserSchema.index({ "authProviders.provider": 1 });

const User = (models.User as UserModel) || model<IUser, UserModel>("User", UserSchema);
export default User;
