import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as authController from "./controller/auth.controller.js";
import {
  addAdminSchema,
  authRegisterSchema,
  forgetPasswordSchema,
  headersSchema,
  logInSchema,
  resetPasswordOTPSchema,
} from "./controller/auth.validation.js";

const router = Router();

//create user
router.post(
  "/addUser",
  isValid(headersSchema, true),
  auth(["admin", "superAdmin"]),
  isValid(authRegisterSchema),
  authController.signUp
);

//create admin
router.post(
  "/addAdmin",
  isValid(headersSchema, true),
  auth(["superAdmin"]),
  isValid(addAdminSchema),
  authController.addAdmin
);

//login
router.post("/login", isValid(logInSchema), authController.logIn);

//log out
router.patch(
  "/logOut",
  isValid(headersSchema, true),
  auth(["user"]),
  authController.logOut
);

//forget password By OTP
router.post(
  "/forgetPasswordOTP",
  isValid(forgetPasswordSchema),
  authController.forgetPasswordOTP
);

//reset password by otp
router.post(
  "/resetPasswordOTP/:userEmail",
  isValid(resetPasswordOTPSchema),
  authController.resetPasswordOTP
);

export default router;
