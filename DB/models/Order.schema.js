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

    originalOrderCostPerHour: Number,

    numberOfHours: { type: Number, required: true },

    shippingCost: {
      type: Number,
      required: false,
      default: 0,
    },

    technicianCost: {
      type: Number,
      required: false,
      default: 0,
    },

    totalCost: { type: Number},

    receivedAmount: { type: Number, required: true },

    remainingAmount: { type: Number},

    discount: Number,

    paymentMethod: {
      type: String,
      num: ["cash", "credit", "bank transfer"],
      required: true,
    },
   
    contents: [{ type: Types.ObjectId, ref: "Product" }],

    salesRepresentative: { type: Types.ObjectId, ref: "User" },

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

orderSchema.pre("save", function(next) {

  if (!this.originalOrderCostPerHour) {
    this.originalOrderCostPerHour = this.orderCostPerHour;
  }
  // Apply discount if it's present
  if (this.discount === 0) {
    this.orderCostPerHour = this.originalOrderCostPerHour;
  } else if (this.discount) {
    // Apply the discount
    const discountPerHour = this.discount / this.numberOfHours;
    this.orderCostPerHour = this.originalOrderCostPerHour - discountPerHour;
  }

  // Check if fields are being updated, if so recalculate total cost and remaining amount
  const isUpdated =
    this.isModified("numberOfHours") ||
    this.isModified("orderCostPerHour") ||
    this.isModified("shippingCost") ||
    this.isModified("technicianCost");

  if (isUpdated) {
    this.totalCost =
    this.numberOfHours * this.orderCostPerHour +
    this.shippingCost +
    this.technicianCost;
  this.remainingAmount = this.totalCost - this.receivedAmount;
  }

  // Handle case when either totalCost or remainingAmount is NaN
  if (isNaN(this.totalCost)) {
    this.totalCost = 0;
  }
  if (isNaN(this.remainingAmount)) {
    this.remainingAmount = 0;
  }

  next();
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
