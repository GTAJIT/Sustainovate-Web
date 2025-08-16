import { Request, Response, NextFunction } from "express";

import { getUser, TokenPayload } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: TokenPayload | null;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.uid; // make sure cookie-parser middleware is used

  if (!token) {
    req.user = null;
    return res.status(401).json({ success: false, message: "No token found" });
  }

  try {
    const user = getUser(token);
    req.user = user || null; // attach decoded user or null
    next();
  } catch (err) {
    req.user = null;
    return res.status(403).json({ success: false, message: "Invalid token", error: err });
  }
}
