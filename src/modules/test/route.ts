import { Router } from "express";

import * as testController from "./controller";

const router = Router();

router.get("/", testController.health);
router.get("/db", testController.dbConnect);
router.get("/redis", testController.testRedis);

export default router;
