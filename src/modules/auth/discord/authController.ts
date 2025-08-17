import { Request, Response, NextFunction } from "express";

import { linkOrCreateUser } from "../authService";
import { handleAuthSuccess } from "../commonAuthHandler";

import { getDiscordAuthUrl, getDiscordUser } from "./discordService";

export function discordLogin(req: Request, res: Response) {
  res.redirect(getDiscordAuthUrl());
}

export async function discordCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.query;
    if (!code || typeof code !== "string") return res.status(400).json({ message: "Missing code" });

    const discordUser = await getDiscordUser(code);
    const user = await linkOrCreateUser("discord", discordUser);

    handleAuthSuccess(res, user, "discord");
  } catch (err) {
    next(err);
  }
}
