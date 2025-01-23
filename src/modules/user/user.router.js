import Router from "express";
import * as userController from "./controller/user.controller.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import {
  getAndDeleteSchema,
  headersSchema,
  updateUserSchema,
} from "./controller/user.validation.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

//get all users
router.get(
  "/allUsers",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  userController.allUsers
);

//get sp user
router.get(
  "/getUser/:userId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(getAndDeleteSchema),
  userController.getUser
);

//update user
router.patch(
  "/updateUser/:userId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(updateUserSchema),
  userController.updateUser
);

//delete user
router.delete(
  "/deleteUser/:userId",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(getAndDeleteSchema),
  userController.deleteUser
);

export default router;
