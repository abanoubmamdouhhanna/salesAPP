import joi from "joi";
import { generalFeilds } from "../../../middlewares/validation.middleware.js";

export const headersSchema = generalFeilds.headers;

export const createClientSchema = joi
  .object({
    name: generalFeilds.userName.required(),

    phone: generalFeilds.phone.required(),

    notes: joi.string(),
  })
  .required();

export const updateClientSchema = joi
  .object({
    name: generalFeilds.userName,

    phone: generalFeilds.phone,

    notes: joi.string(),

    clientId: generalFeilds.id,
  })
  .required();

export const getAndDeleteSchema = joi
  .object({
    clientId: generalFeilds.id,
  })
  .required();
