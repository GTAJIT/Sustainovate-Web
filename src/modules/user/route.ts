import { Router } from "express";

import * as userController from "./controller";

const router = Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);

export default router;
