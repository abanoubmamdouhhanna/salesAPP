import moment from "moment/moment.js";
import sendEmail from "../../../utils/Emails/sendEmail.js";
import { otpEmail } from "../../../utils/Emails/optEmail.js";
import { compare, Hash } from "../../../utils/Hash&Compare.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { otp } from "../../../utils/otpGenerator.js";
import {
  generateToken,
  verifyToken,
} from "../../../utils/generateAndVerifyToken.js";
import userModel from "../../../../DB/models/User.model.js";

// create user
export const signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password, phone, salary } = req.body;

  // Run the email and username existence checks in parallel
  const [existedUser, checkExistUserName] = await Promise.all([
    userModel.findOne({ email }),
    userModel.findOne({ userName }),
  ]);

  if (existedUser) {
    return next(new Error("Email already exists", { cause: 401 }));
  }

  if (checkExistUserName) {
    return next(new Error("Username already exists", { cause: 401 }));
  }

  // Hash password
  const hashPassword = Hash({ plainText: password });

  // Create the user in the database
  const createUser = await userModel.create({
    userName,
    email,
    password: hashPassword,
    phone,
    salary,
  });

  // Respond immediately without waiting for the email to be sent
  return res.status(201).json({
    message: "User added successfully.",
    user: createUser._id,
  });
});

//====================================================================================================================//
// create admin

export const addAdmin = asyncHandler(async (req, res, next) => {
  const { userName, email, password} = req.body;

  // Run the email and username existence checks in parallel
  const [existedUser, checkExistUserName] = await Promise.all([
    userModel.findOne({ email }),
    userModel.findOne({ userName }),
  ]);

  if (existedUser) {
    return next(new Error("Email already exists", { cause: 401 }));
  }

  if (checkExistUserName) {
    return next(new Error("Username already exists", { cause: 401 }));
  }

  // Hash password
  const hashPassword = Hash({ plainText: password });

  // Create the admin in the database
  const createUser = await userModel.create({
    userName,
    email,
    password: hashPassword,
    role:"admin"   
  });

  // Respond immediately without waiting for the email to be sent
  return res.status(201).json({
    message: "Admin added successfully.",
    user: createUser._id,
  });
});

//====================================================================================================================//

// log in
export const logIn = asyncHandler(async (req, res, next) => {
  const { userName, password } = req.body;

  // Validate input data
  if (!password || !userName) {
    return next(
      new Error("Username and password are required.", { cause: 400 })
    );
  }

  // Query user by either userName or email
  const user = await userModel
    .findOne({
      userName,
    })
    .select("password isDeleted isBlocked userName email role");

  // Handle user not found or inactive accounts
  if (!user) {
    return next(
      new Error("Invalid credentials, please try again.", { cause: 404 })
    );
  }

  if (user.isDeleted || user.isBlocked) {
    return next(
      new Error(
        "Your account is suspended or removed. Contact support for assistance.",
        { cause: 403 }
      )
    );
  }
  // Verify password
  const isPasswordValid = compare({
    plainText: password,
    hashValue: user.password,
  });
  if (!isPasswordValid) {
    return next(
      new Error("Incorrect password. Please try again.", { cause: 401 })
    );
  }

  // Generate JWT token
  const token = generateToken({
    payload: {
      id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
  });

  // Update status (optional, based on your business logic)
  if (user.status !== "Active") {
    user.status = "Active";
    await user.save();
  }

  // Respond to client
  return res.status(200).json({
    message: `welcome ${user.role}! Logged in successfully.`,
    authorization: { token },
    result:user
  });
});
//====================================================================================================================//
//log out

export const logOut = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    { status: "not Active" },
    { new: true }
  );
  return res.status(200).json({
    status: "success",
    message: "LoggedOut successfully",
  });
});

//====================================================================================================================//
//forget password By OTP
export const forgetPasswordOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("User not found!", { cause: 404 }));
  }
  const OTP = otp();
  await userModel.findOneAndUpdate(
    { email },
    {
      otp: Hash({ plainText: OTP }),
      otpexp: moment().add(1, "day"),
    }
  );
  const redirectLink = `${req.protocol}://${req.headers.host}/auth/resetPasswordOTP/${email}`;

  const html = otpEmail(OTP, redirectLink);
  const info = await sendEmail({
    to: email,
    subject: "Forget Password otp",
    html,
  });
  if (!info) {
    return next(new Error("Rejected Email", { cause: 400 }));
  }
  return res.status(200).json({
    status: "success",
    message: "OTP code have been sent to your account",
  });
});
//====================================================================================================================//
//reset password by otp

export const resetPasswordOTP = asyncHandler(async (req, res, next) => {
  const { userEmail } = req.params;
  const { otp, password } = req.body;
  const user = await userModel.findOne({ email: userEmail });
  if (!user) {
    return next(new Error("User not found!", { cause: 404 }));
  }
  if (moment().diff(user.otpexp, "hours") >= 0) {
    return next(new Error(`OTP code has been Expired`, { cause: 410 }));
  }

  const matchOTP = compare({ plainText: otp, hashValue: user.otp });
  if (matchOTP) {
    (user.password = Hash({ plainText: password })), (user.otp = undefined);
    user.otpexp = undefined;
    user.changeAccountInfo = Date.now();
    user.status = "not Active";
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password has been changed successfully",
    });
  }
  return next(new Error(`Invalid OTP code`, { cause: 409 }));
});
