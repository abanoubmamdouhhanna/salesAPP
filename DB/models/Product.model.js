import mongoose, { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },

    categoryId: { type: Types.ObjectId, ref: "Category" },

    quantitiy: { type: Number, required: true },

    maintenanceId: { type: Types.ObjectId, ref: "Maintenance" },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
productSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

productSchema.virtual("categoryDetails", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
});

productSchema.virtual("maintenanceDetails", {
  ref: "Maintenance",
  localField: "maintenanceId",
  foreignField: "_id",
});

const producrModel = mongoose.models.Product || model("Product", productSchema);
export default producrModel;
