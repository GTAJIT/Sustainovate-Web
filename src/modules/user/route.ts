import { Router } from "express";

import * as userController from "./controller/userController";
import * as authController from "./controller/authController";

const router = Router();

//GET
router.get("/", userController.getAllUsers);
// router.get("/:id", userController.getUserById);
router.get("/:identifier", userController.getUser);

//POST
router.post("/login", authController.login);
router.post("/signup", authController.signup);

//EDIT
router.put("/:id", userController.updateUserById);

//DELETE
router.delete("/:id", userController.deleteUserById);

export default router;
