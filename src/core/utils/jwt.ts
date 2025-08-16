import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const secret = process.env.SECRET_KEY || "fallback_secret";

export interface TokenPayload {
  _id: string;
  email: string;
  role: "user" | "admin" | "moderator";
}

// Create JWT
export function setUser(user: TokenPayload): string {
  return jwt.sign(user, secret, { expiresIn: "7d" });
}

// Verify JWT
export function getUser(token?: string): TokenPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, secret) as TokenPayload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null;
  }
}
