import joi from "joi";
import { generalFeilds } from "../../../middlewares/validation.middleware.js";

export const headersSchema = generalFeilds.headers;

export const createProductSchema = joi
  .object({
    name: generalFeilds.name.required(),

    quantitiy: joi.number().integer().positive().min(1).required(),

    categoryId: generalFeilds.id,
  })
  .required();

export const updateProductSchema = joi
  .object({
    name: generalFeilds.name,

    quantitiy: joi.number().integer().positive().min(1),

    productId: generalFeilds.id,
  })
  .required();

export const getAndDeleteSchema = joi
  .object({
    productId: generalFeilds.id,
  })
  .required();
