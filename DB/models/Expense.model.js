import mongoose, { model, Schema, Types } from "mongoose";

const expenseSchema = new Schema(
  {
    date: { type: Date, default: Date.now() },

    category: { type: Types.ObjectId, ref: "ExpenseCategory", required: true }, // e.g., salaries, rent, electricity

    amount: { type: Number, required: true },

    description: { type: String },

    notes: String,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true }}
);
expenseSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

expenseSchema.virtual("categoryDetails", {
  ref: "ExpenseCategory",
  localField: "category",
  foreignField: "_id",
});

const expenseModel = mongoose.models.Expense || model("Expense", expenseSchema);
export default expenseModel;
