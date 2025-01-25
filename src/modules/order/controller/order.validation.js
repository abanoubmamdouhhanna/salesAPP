import joi from "joi";
import { generalFeilds } from "../../../middlewares/validation.middleware.js";

export const headersSchema = generalFeilds.headers;

export const createOrderSchema = joi
  .object({
    registrationNumber: joi.string().required(),

    invoiceNumber: joi.string().required(),

    orderType: joi.string().required(),

    numberOfHours: joi.number().min(1).required(),

    orderCostPerHour: joi.number().min(0).required(),

    shippingCost: joi.number().min(0).default(0),

    technicianCost: joi.number().min(0).default(0),

    receivedAmount: joi.number().min(0).required(),

    paymentMethod: joi
      .string()
      .valid("cash", "credit", "bank transfer")
      .required(),

    salesRepresentative: generalFeilds.optionalId,

    clientId: generalFeilds.id,

    address: joi.string().required(),

    recipientName: joi.string().optional(),

    discount: joi.number().min(0).default(0),

    contents: joi.array().items(generalFeilds.id).optional(),
  })
  .required();

export const updateOrderSchema = joi
  .object({
    orderId: generalFeilds.id,

    registrationNumber: joi.string(),

    invoiceNumber: joi.string(),

    orderType: joi.string(),

    numberOfHours: joi.number().min(1),

    orderCostPerHour: joi.number().min(0),

    shippingCost: joi.number().min(0).default(0),

    technicianCost: joi.number().min(0).default(0),

    receivedAmount: joi.number().min(0),

    paymentMethod: joi.string().valid("cash", "credit", "bank transfer"),

    salesRepresentative: generalFeilds.optionalId,

    clientId: generalFeilds.optionalId,

    address: joi.string(),

    recipientName: joi.string().optional(),

    discount: joi.number().min(0).default(0),

    contents: joi.array().items(generalFeilds.id).optional(),
  })
  .required();

export const getAndDeleteSchema = joi
  .object({
    orderId: generalFeilds.id,
  })
  .required();
