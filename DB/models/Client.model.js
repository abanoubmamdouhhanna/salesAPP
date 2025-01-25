import mongoose, { model, Schema, Types } from "mongoose";

const clientSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: [true, "name is required"],
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },
    
    notes:String,
    
    totalPaid: {
      type: Number,
      default: 0,
    },
    
    totalRemaining: {
      type: Number,
      default: 0,
    },
    
    orders: [{ type: Types.ObjectId, ref: "Order" }],
    
    createdBy: { type: Types.ObjectId, ref: "User" },

    updatedBy: { type: Types.ObjectId, ref: "User" },

    
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
clientSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

clientSchema.virtual('clientOrders', {
  ref: 'Order', 
  localField: 'orders', 
  foreignField: '_id', 
});

const clientModel = mongoose.models.Client || model("Client", clientSchema);
export default clientModel;
