import joi from "joi";
import { generalFeilds } from "../../../middlewares/validation.middleware.js";

export const headersSchema = generalFeilds.headers;

export const createCategorySchema = joi
  .object({
    name: generalFeilds.name.required(),

    description: joi.string(),

  })
  .required();

export const updateCategorySchema = joi
  .object({
    name: generalFeilds.name,

    description: joi.string(),

    categoryId: generalFeilds.id,
  })
  .required();

export const getAndDeleteSchema = joi
  .object({
    categoryId: generalFeilds.id,
  })
  .required();
