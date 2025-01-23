import mongoose, { model, Schema, Types } from "mongoose";

const bankSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    
    deposit: { type: Number, default: 0 },
    
    disbursement: { type: Number, default: 0 },
    
    net: { type: Number, default: 0 },

    notes: String,

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
bankSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

const bankModel = mongoose.models.Bank || model("Bank", bankSchema);
export default bankModel;
