import { Router } from "express";

import baseRouter from "./modules/base/route";
import userRoutes from "./modules/user/route";
// import authRoutes from "./modules/auth/route";
// import eventRoutes from "./modules/event/route";
import testRouters from "./modules/test/route";

const router = Router();

//base route
router.use("/", baseRouter);

// test routes
router.use("/test", testRouters);

// main routes
router.use("/users", userRoutes);
// router.use("/auth", authRoutes);
// router.use("/events", eventRoutes);

export default router;
