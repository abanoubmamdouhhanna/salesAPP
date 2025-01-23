import mongoose, { model, Schema, Types } from "mongoose";

const technicianSchema = new Schema(
  {
    name: { type: String, required: true },
   
    specialization: { type: String, required: true },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
technicianSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

const technicianModel =
  mongoose.models.Technician || model("Technician", technicianSchema);
export default technicianModel;
