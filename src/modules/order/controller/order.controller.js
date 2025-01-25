import orderModel from "../../../../DB/models/Order.schema.js";
import { asyncHandler } from "../../../utils/errorHandling.js";

export const addOrder = asyncHandler(async (req, res, next) => {
  const {
    registrationNumber,
    invoiceNumber,
    orderType,
    numberOfHours,
    orderCostPerHour,
    shippingCost,
    technicianCost,
    receivedAmount,
    paymentMethod,
    salesRepresentative,
    clientId,
    address,
    recipientName,
    contents,
    discount,
  } = req.body;

  // Create a new order document
  const order = new orderModel({
    registrationNumber,
    invoiceNumber,
    orderType,
    numberOfHours,
    orderCostPerHour,
    shippingCost,
    technicianCost,
    receivedAmount,
    paymentMethod,
    salesRepresentative,
    createdBy: req.user._id,
    clientId,
    address,
    recipientName,
    contents,
    discount,
  });
  await order.save();
  // Respond with success and the newly created order data
  res.status(201).json({
    message: "Order created successfully",
    order,
  });
});

//====================================================================================================================//
//update order

export const updateOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  // Find the order by ID
  const order = await orderModel.findById(orderId);
  if (!order) {
    return next(new Error("Invalid order ID.", { cause: 400 }));
  }

  // Extract the fields that you want to validate
  const {
    registrationNumber,
    invoiceNumber,
    orderType,
    numberOfHours,
    orderCostPerHour,
    shippingCost,
    technicianCost,
    receivedAmount,
    paymentMethod,
    salesRepresentative,
    clientId,
    address,
    recipientName,
    contents,
    discount,
  } = req.body;

  // Check if at least one field is provided for update
  const updatedFields = {
    registrationNumber,
    invoiceNumber,
    orderType,
    numberOfHours,
    orderCostPerHour,
    shippingCost,
    technicianCost,
    receivedAmount,
    paymentMethod,
    salesRepresentative,
    clientId,
    address,
    recipientName,
    contents,
    discount,
  };

  const fieldsToUpdate = Object.keys(updatedFields).filter(
    (key) => updatedFields[key] !== undefined
  );

  if (fieldsToUpdate.length === 0) {
    return next(
      new Error("At least one field must be provided for update", {
        cause: 400,
      })
    );
  }

  // Compare existing values with the new ones and ensure no same values are being set
  for (let key of fieldsToUpdate) {
    if (order[key] === updatedFields[key]) {
      return next(
        new Error(
          `Cannot update ${key} with the same value. Please provide a different value.`,
          { cause: 400 }
        )
      );
    }
  }

  // Update the order with new values
  for (let key of fieldsToUpdate) {
    order[key] = updatedFields[key];
  }

  order.updatedBy = req.user._id;

  await order.save();

  res.status(200).json({
    message: "Order updated successfully",
    order,
  });
});
//====================================================================================================================//
//delete order

export const deleteOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await orderModel.findByIdAndDelete(orderId);
  if (!order) {
    return next(new Error("order not found", { cause: 404 }));
  }

  return res
    .status(200)
    .json({ message: "Product deleted successfully", result: order });
});
//====================================================================================================================//
//get all Orders

export const allOrders = asyncHandler(async (req, res, next) => {
  const allOrders = await orderModel.find();
  if (!allOrders.length) {
    return res.status(404).json({
      status: "failure",
      message: "No Orders found!",
    });
  }
  return res.status(200).json({
    status: "success",
    message: "All Orders!",
    count: allOrders.length,
    result: allOrders,
  });
});
//====================================================================================================================//
//get sp order

export const getOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await orderModel.findById(orderId);
  if (!order) {
    return next(new Error("Invalid order ID.", { cause: 400 }));
  }
  return res.status(200).json({
    status: "success",
    message: "Done!",
    result: order,
  });
});
