import jwt, { SignOptions } from 'jsonwebtoken';
import type { IUser } from '@sustainovate/shared/schemas';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

export interface JWTPayload {
  userId: string;
  discordId?: string;
  githubId?: string;
  username: string;
  role: string;
  authProvider: 'discord' | 'github';
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT token for user
 */
export const generateToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: (user._id as any).toString(),
    discordId: user.discordId,
    githubId: (user as any).githubId,
    username: user.username,
    role: user.role,
    authProvider: user.authProvider,
  };

  return jwt.sign(payload, JWT_SECRET!, { expiresIn: '7d' });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET!) as JWTPayload;
};

/**
 * Decode JWT token without verification (for debugging)
 */
export const decodeToken = (token: string): JWTPayload | null => {
  const decoded = jwt.decode(token);
  return decoded as JWTPayload | null;
};
