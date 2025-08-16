import { Router } from "express";

import userRoutes from "./modules/user/route";
// import authRoutes from "./modules/auth/route";
// import eventRoutes from "./modules/event/route";

const router = Router();

router.use("/users", userRoutes);
// router.use("/auth", authRoutes);
// router.use("/events", eventRoutes);

export default router;
