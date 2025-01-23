import mongoose, { model, Schema, Types } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },

    description: String,

    products: [{ type: Types.ObjectId, ref: "Product" }],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }}
);
categorySchema.pre("find", function () {
  this.where({ isDeleted: false });
});

categorySchema.virtual("productDetails", {
  ref: "Prouct",
  localField: "products",
  foreignField: "_id",
});

const categoryModel =
  mongoose.models.Category || model("Category", categorySchema);
export default categoryModel;
