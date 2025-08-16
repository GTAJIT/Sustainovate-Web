import { Router } from "express";

import { authenticateToken } from "../../core/middlewares/auth";

import * as userController from "./controller/userController";
import * as authController from "./controller/authController";

const router = Router();

//GET
router.get("/", authenticateToken, userController.getAllUsers);
router.get("/me", authenticateToken, userController.getMe);
router.get("/:identifier", userController.getUser);

//POST
router.post("/login", authController.login);
router.post("/signup", authController.signup);

//EDIT
router.put("/:id", authenticateToken, userController.updateUserById);

//DELETE
router.delete("/:id", authenticateToken, userController.deleteUserById);

export default router;
