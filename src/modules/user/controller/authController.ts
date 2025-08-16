import { Request, Response } from "express";

import User from "../modle";
import * as userService from "../service";

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check existing user
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const existingUserName = await userService.findByUsername(username);
    if (existingUserName) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Create user
    const newUser = await userService.create({ username, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Login failed, please try again later", error: err });
  }
};
