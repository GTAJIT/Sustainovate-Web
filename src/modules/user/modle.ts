import { Schema, Types, model, models, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  _id: Types.ObjectId;
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
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserModel = Model<IUser, object, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
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

    role: { type: String, enum: ["user", "admin", "moderator"], default: "user" },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = (models.User as UserModel) || model<IUser, UserModel>("User", UserSchema);
export default User;
