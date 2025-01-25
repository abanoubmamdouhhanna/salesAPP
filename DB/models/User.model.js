import mongoose, { model, Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      min: 3,
      max: 20,
      lowercase: true,
      required: [true, "userName is required"],
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    salary: {
      type: Number
    },
    financialCommitments:Number,
    status: {
      type: String,
      default: "not Active",
      enum: ["Active", "not Active"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["superAdmin", "admin", "user"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    otp: String,
    otpexp: Date,
    permanentlyDeleted: Date,
    changeAccountInfo: Date,
  },
  { timestamps: true }
);
userSchema.pre("find", function () {
  this.where({ isDeleted: false });
});


const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
