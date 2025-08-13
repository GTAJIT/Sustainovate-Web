import { Request, Response, NextFunction } from 'express';
import { verifyToken, type JWTPayload } from '../utils/jwt.js';
import { User, type IUser } from '@sustainovate/shared/schemas';

// Extend Express User interface to include our user properties
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'NO_TOKEN' 
      });
    }

    // Verify token
    const payload: JWTPayload = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(payload.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        error: 'Invalid or inactive user',
        code: 'INVALID_USER' 
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid token',
      code: 'INVALID_TOKEN' 
    });
  }
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'NO_AUTH' 
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (token) {
      const payload: JWTPayload = verifyToken(token);
      const user = await User.findById(payload.userId);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Ignore token errors for optional auth
    next();
  }
};
