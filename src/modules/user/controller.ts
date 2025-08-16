import { Request, Response, NextFunction } from "express";

import * as userService from "./service";

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userService.getAll();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getById(req.params.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const newUser = await userService.create(req.body);
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    next(err);
  }
}
