import { Request, Response, NextFunction } from "express";

import { getUser, TokenPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: TokenPayload | null;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.uid; // requires cookie-parser

  if (!token) {
    req.user = null;
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    const user = getUser(token);

    if (!user) {
      req.user = null;
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }

    req.user = user; // attach decoded user
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    req.user = null;
    return res.status(403).json({ success: false, message: "Token verification failed" });
  }
}
