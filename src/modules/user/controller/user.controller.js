import userModel from "../../../../DB/models/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { compare, Hash } from "../../../utils/Hash&Compare.js";

//get all users
export const allUsers = asyncHandler(async (req, res, next) => {
  const allUsers = await userModel.find({ role: "user" });
  if (!allUsers.length) {
    return res.status(404).json({
      status: "failure",
      message: "No users found!",
    });
  }
  return res.status(200).json({
    status: "success",
    message: "All users!",
    count: allUsers.length,
    result: allUsers,
  });
});
//====================================================================================================================//
//get sp user

export const getUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("Invalid user ID.", { cause: 400 }));
  }
  return res.status(200).json({
    status: "success",
    message: "Done!",
    result: user,
  });
});
//====================================================================================================================//
//update user

export const updateUser = asyncHandler(async (req, res, next) => {
  const{userId}=req.params
  const { userName, email, phone, salary, oldPassword, newPassword } = req.body;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("In-valid user ID.", { cause: 400 }));
  }
  if (!(userName || email || phone || (oldPassword && newPassword) || salary)) {
    return next(new Error("We need information to update", { cause: 400 }));
  }
  if (userName || email || phone || salary) {
    const object = { ...req.body };
    for (let key in object) {
      if (user[key] == object[key]) {
        return next(
          new Error(
            `Cannot update ${key} with the same value. Please provide a different value.`,
            { cause: 400 }
          )
        );
      }
    }
  }
  if (userName || email) {
    const existingUser = await userModel.findOne({
      $or: [{ userName }, { email }],
    });

    if (existingUser) {
      if (existingUser.userName === userName) {
        return next(
          new Error("The username you have chosen is already taken.", {
            cause: 409,
          })
        );
      }
      if (existingUser.email === email) {
        return next(
          new Error("The email you have entered is already in use.", {
            cause: 409,
          })
        );
      }
    }
  }
  if (user.isDeleted) {
    return next(
      new Error(
        "Cannot update user information because the account is suspended or deleted.",
        { cause: 403 }
      )
    );
  }
  if (oldPassword && newPassword) {
    const matchOld = compare({
      plainText: oldPassword,
      hashValue: user.password,
    });
    if (!matchOld) {
      return next(new Error("In-valid password", { cause: 400 }));
    }
    const checkMatchNew = compare({
      plainText: newPassword,
      hashValue: user.password,
    });
    if (checkMatchNew) {
      return next(
        new Error("New password can't be old password", { cause: 400 })
      );
    }
    const hashPassword = Hash({ plainText: newPassword });
    req.body.password = hashPassword;
    req.body.changeAccountInfo = Date.now();
  }

  const updateUser = await userModel.findByIdAndUpdate(userId, req.body, {
    new: true,
  });
  return res.status(200).json({
    status: "success",
    message: "User updated successfully.",
    result: updateUser,
  });
});
//====================================================================================================================//
//delete user

export const deleteUser = asyncHandler(async (req, res, next) => {
  const User = await userModel.findByIdAndDelete(req.params.userId);
  if (!User) {
    return next(new Error("User not found", { cause: 404 }));
  }
  return res
    .status(200)
    .json({ message: "User deleted successfully", result: User });
});
