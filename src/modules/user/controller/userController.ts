import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose"; // for validating the type

import * as userService from "../service";
import { AuthRequest } from "../../../core/middlewares/auth";
import User from "../modle";

// GET all users data
export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find(
      {},
      {
        _id: 1,
        username: 1,
        globalName: 1,
        avatar: 1,
        points: 1,
        email: 1,
      },
    ).lean();

    // Map to consistent public fields
    const publicUsers = users.map((u) => ({
      id: u._id,
      name: u.globalName || u.username.split(" ")[0],
      username: u.username,
      email: u.email || null,
      avatar: u.avatar || "",
      points: u.points ?? 0,
    }));

    res.json({ data: publicUsers });
  } catch (err) {
    next(err);
  }
}

// GET all users all data
export async function getAllUsersData(req: Request, res: Response, next: NextFunction) {
  try {
    let users: unknown = await userService.getAll();
    if (!users) users = "No Users";
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

// GET user by any
export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { identifier } = req.params;
    let user = null;
    // Try by ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      user = await userService.getById(identifier);
    }
    // If not found & identifier looks like an email
    if (!user && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
      user = await userService.findByEmail(identifier);
    }
    // If still not found → fallback to username
    if (!user) {
      user = await userService.findByUsername(identifier);
    }
    // Handle user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Success
    return res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

// Edit user by ID
export async function updateUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const updatedUser = await userService.updateById(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}

// Delete user by ID
export async function deleteUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const deletedUser = await userService.deleteById(req.params.id, password);
    if (!deletedUser) {
      return res.status(401).json({ message: "Invalid credentials or user not found" });
    }

    res.json({
      message: "User deleted successfully",
      user: {
        id: deletedUser._id,
        email: deletedUser.email,
        username: deletedUser.username,
      },
    });
  } catch (err) {
    next(err);
  }
}
export async function getMe(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  // req.user should already have the info from authenticateToken
  res.status(200).json({ success: true, user: req.user });
}
