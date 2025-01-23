import mongoose, { model, Schema, Types } from "mongoose";

const maintenanceSchema = new Schema(
  {
    equipmentName: { type: Types.ObjectId, ref: "Product", required: true },

    equipmentType: { type: Types.ObjectId, ref: "Category", required: true },

    maintenanceCost: { type: Number, required: true },

    maintenanceDate: { type: Date, default: Date.now },

    description: { type: String },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true }}
);
maintenanceSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

maintenanceSchema.virtual("equipmentDetails", {
  ref: "Product",
  localField: "equipmentName",
  foreignField: "_id",
});

maintenanceSchema.virtual("categoryDetails", {
  ref: "Category",
  localField: "equipmentType",
  foreignField: "_id",
});

const maintenanceModel =
  mongoose.models.Maintenance || model("Maintenance", maintenanceSchema);
export default maintenanceModel;
