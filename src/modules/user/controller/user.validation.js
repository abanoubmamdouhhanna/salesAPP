import joi from "joi";
import { generalFeilds } from "../../../middlewares/validation.middleware.js";

export const headersSchema=generalFeilds.headers

export const updateUserSchema= joi.object(
    {
        userName: generalFeilds.userName,

        email: generalFeilds.email,

        password:generalFeilds.password,

        cPassword:generalFeilds.cPassword.valid(joi.ref("password")),

        phone:generalFeilds.phone,

        userId:generalFeilds.id,

        salary: joi.number().positive()
    }
).required()

export const getAndDeleteSchema= joi.object(
    {
   userId:generalFeilds.id,

    }
).required()



