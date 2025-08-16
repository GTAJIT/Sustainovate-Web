import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

import User from "../modle";
import { setUser } from "../../../core/utils/jwt";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, email, password } = req.body;

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });

    const user = new User({ username, email, password });
    await user.save();

    const token = setUser({ _id: user._id.toString(), email: user.email, role: user.role });
    res.json({ success: true, token, user: { _id: user._id, username, email, role: user.role } });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = setUser({ _id: user._id.toString(), email: user.email, role: user.role });
    res
      .cookie("uid", token, {
        httpOnly: true, // JS in browser cannot access it
        secure: process.env.NODE_ENV === "production", // true in production (HTTPS)
        sameSite: "lax", // or "none" if cross-site
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
      .json({
        // cookie
        success: true,
        token,
        user: { _id: user._id, username: user.username, email, role: user.role },
      });
  } catch (err) {
    next(err);
  }
}
