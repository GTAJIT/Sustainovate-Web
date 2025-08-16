import { Schema, Types, model, models, Model } from "mongoose";
import bcrypt from "bcryptjs";

/**
 * User schema fields (document shape)
 */
export interface IUser {
  _id: Types.ObjectId;

  // OAuth fields
  discordId?: string;
  username: string;
  email: string;
  password: string;
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

  // App-specific fields
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Instance methods (available on documents)
 */
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Model type (document + methods)
 */
export type UserModel = Model<IUser, object, IUserMethods>;

/**
 * Schema definition
 */
const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    // OAuth fields
    discordId: { type: String, unique: true, sparse: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },

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

    // App-specific
    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

/**
 * Middleware: hash password before saving
 */
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

/**
 * Instance methods
 */
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Ensure single model export (important for hot-reload environments like Next.js)
 */
const User = (models.User as UserModel) || model<IUser, UserModel>("User", UserSchema);

export default User;
