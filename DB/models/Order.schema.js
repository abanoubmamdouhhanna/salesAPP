import mongoose, { model, Schema, Types } from "mongoose";

const orderSchema = new Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    orderType: { type: String, required: true },

    numberOfHours: { type: Number, required: true },

    receiptDate: { type: Date, required: true, default: Date.now() },

    deliveryDate: { type: Date, required: true, default: Date.now() },

    address: { type: String, required: true },

    recipientName: { type: String },

    orderCostPerHour: { type: Number, required: true },

    noOfHours: { type: Number, required: true },

    totalCost: { type: Number, required: true },

    receivedAmount: { type: Number, required: true },

    remainingAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      num: ["cash", "credit", "bank transfer"],
      required: true,
    },

    contents: [{ type: Types.ObjectId, ref: "Product" }],

    salesRepresentative: { type: Types.ObjectId, ref: "User", required: true },

    clientId: { type: Types.ObjectId, ref: "Client", required: true },

    createdBy: { type: Types.ObjectId, ref: "User" },

    updatedBy: { type: Types.ObjectId, ref: "User" },


    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
orderSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

orderSchema.virtual("contentsDetails", {
  ref: "Product",
  localField: "contents",
  foreignField: "_id",
});

orderSchema.virtual("salesRepDetails", {
  ref: "User",
  localField: "salesRepresentative",
  foreignField: "_id",
});

orderSchema.virtual("clientDetails", {
  ref: "Client",
  localField: "clientId",
  foreignField: "_id",
});

orderSchema.virtual("creatorDetails", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
});

orderSchema.virtual("updaterDetails", {
  ref: "User",
  localField: "updatedBy",
  foreignField: "_id",
});

const orderModel = mongoose.models.Order || model("Order", orderSchema);
export default orderModel;
