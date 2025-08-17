import { Request, Response, NextFunction } from "express";

import { linkOrCreateUser } from "../authService";
import { handleAuthSuccess } from "../commonAuthHandler";

import { getGithubAuthUrl, getGithubUser } from "./githubService";

export function githubLogin(req: Request, res: Response) {
  res.redirect(getGithubAuthUrl());
}

export async function githubCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const code = req.query.code as string | undefined;
    if (!code) return res.status(400).json({ message: "Missing code" });

    const githubUser = await getGithubUser(code);
    const user = await linkOrCreateUser("github", githubUser);

    handleAuthSuccess(res, user, "github");
  } catch (err) {
    next(err);
  }
}
