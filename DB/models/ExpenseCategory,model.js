import { ref } from "joi";
import mongoose, { model, Schema, Types } from "mongoose";

const expenseCategoreySchema = new Schema(
  {
    name: { type: String, required: true },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
expenseCategoreySchema.pre("find", function () {
  this.where({ isDeleted: false });
});

const expenseCategoryModel =
  mongoose.models.ExpenseCategory ||
  model("ExpenseCategory", expenseCategoreySchema);
export default expenseCategoryModel;
