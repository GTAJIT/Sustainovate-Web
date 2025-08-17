import { Request, Response, NextFunction } from "express";

import { linkOrCreateUser } from "../authService";
import { handleAuthSuccess } from "../commonAuthHandler";

import { getGoogleAuthUrl, getGoogleUser } from "./googleService";

export function googleLogin(req: Request, res: Response) {
  res.redirect(getGoogleAuthUrl());
}

export async function googleCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.query;
    if (!code || typeof code !== "string") return res.status(400).json({ message: "Missing code" });

    const googleUser = await getGoogleUser(code);
    const user = await linkOrCreateUser("google", googleUser);

    handleAuthSuccess(res, user, "google");
  } catch (err) {
    next(err);
  }
}
