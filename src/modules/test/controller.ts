// src/modules/user/controller.ts
import { Request, Response, NextFunction } from "express";

import { connectDB } from "../../core/config/database";
import { connectRedis } from "../../core/config/redis";

export async function health(_req: Request, res: Response, _next: NextFunction) {
  res.json({ status: "ok", uptime: process.uptime() });
}

export async function dbConnect(_req: Request, res: Response, _next: NextFunction) {
  const db = await connectDB();
  res.json({ success: !!db, db: db ? "connected" : "no connection" });
}

export async function testRedis(_req: Request, res: Response) {
  const client = await connectRedis();
  if (client) {
    await client.set("ping", "pong");
    const value = await client.get("ping");
    res.json({ success: true, value });
  } else {
    res.json({ success: false, message: "Redis not connected" });
  }
}
