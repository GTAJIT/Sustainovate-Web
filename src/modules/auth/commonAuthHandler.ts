import { Response } from "express";
import { config } from "dotenv";

config();

import { setUser } from "../../core/utils/jwt";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleAuthSuccess(res: Response, user: any, auth: string) {
  const token = setUser({
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  res.cookie("uid", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  // 🚀 redirect instead of sending JSON
  if (auth === "custom") {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.redirect(process.env.AUTH_REDIRECT_URL!);
  }
}

export function logout(req: Request, res: Response) {
  res.cookie("uid", "", {
    httpOnly: true,
    expires: new Date(0), // expire immediately
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ success: true, message: "Logged out" });
}
