import joi from 'joi'
import { generalFeilds } from '../../../middlewares/validation.middleware.js'

export const headersSchema= generalFeilds.headers

export const authRegisterSchema= joi.object(
    {
        userName: generalFeilds.userName.required(),

        email: generalFeilds.email.required(),

        password:generalFeilds.password.required(),

        cPassword:generalFeilds.cPassword.valid(joi.ref("password")).required(),

        phone:generalFeilds.phone.required(),

        salary: joi.number().positive().required()
    }
).required()

export const addAdminSchema= joi.object(
    {
        userName: generalFeilds.userName.required(),

        email: generalFeilds.email.required(),

        password:generalFeilds.password.required(),

        cPassword:generalFeilds.cPassword.valid(joi.ref("password")).required(),

        phone:generalFeilds.phone

    }
).required()

export const logInSchema=joi.object(
    {
        userName:generalFeilds.userName.required(),

        password:generalFeilds.password.required()
    }
).required()


export const forgetPasswordSchema=joi.object(
    {
        email:generalFeilds.email.required()
    }
).required()


export const resetPasswordOTPSchema=joi.object(
    {
        userEmail:generalFeilds.email.required(),
        password:generalFeilds.password.required(),
        otp:generalFeilds.otp
    }
).required()