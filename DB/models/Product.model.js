import mongoose, { model, Schema, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },

    quantitiy: { type: Number, required: true },

    categoryId: { type: Types.ObjectId, ref: "Category" },

    maintenanceId: { type: Types.ObjectId, ref: "Maintenance" },
    
    createdBy: { type: Types.ObjectId, ref: "User" },

    updatedBy: { type: Types.ObjectId, ref: "User" },


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

const productModel = mongoose.models.Product || model("Product", productSchema);
export default productModel;
