import { Router } from "express";

import { googleLogin, googleCallback } from "./google/authController";
import { discordLogin, discordCallback } from "./discord/authController";
import { githubLogin, githubCallback } from "./github/authController";
import { login, signup } from "./custom/authController";
// import { logout } from "./commonAuthHandler";

const router = Router();

// Redirect paths
router.get("/google", googleLogin);
router.get("/discord", discordLogin);
router.get("/github", githubLogin);

// Google callback
router.get("/google/callback", googleCallback);
router.get("/discord/callback", discordCallback);
router.get("/github/callback", githubCallback);

// Custom auth
router.post("/login", login);
router.post("/signup", signup);

// Logout
// router.post("/logout", logout);

export default router;
