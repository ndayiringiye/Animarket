import {check} from "express-validator";
import User from "../model/UserModel.js";
import { isValidObjectId } from "mongoose";
import joi from "joi";

const userRegisterationSchema = joi.object({
    name: joi.string().required().capitalized().min(3).max(30),
    email: joi.string().email().required().messages({
        "string.email": "Email is invalid",
        "any.required": "Email is required",
        "string.empty": "Email is required"
    }),
    phone: joi.string().required().length(10).pattern(/^[0-9]+$/).required().messages({
        "string.length": "Phone number must be 10 digits",
        "string.pattern.base": "Phone number must be 10 digits",
        "any.required": "Phone number is required",
        "string.empty": "Phone number is required"
    }),
    password: joi.string().required().strongPassword().messages({
        "string.length": "Password must be at least 8 characters",
        "any.required": "Password is required",
        "string.empty": "Password is required"
    }).pattern(/[0-9]/).messages({
        "string.pattern.base": "Password must contain at least one number"
    }).pattern(/[A-Z]/).messages({
        "string.pattern.base": "Password must contain at least one uppercase letter"
    }).pattern(/[a-z]/).messages({
        "string.pattern.base": "Password must contain at least one lowercase letter"
    }).pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).messages({
        "string.pattern.base": "Password must contain at least one special character"
    }).pattern(/[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).messages({
        "string.pattern.base": "Password must contain at least one special character"
    }),
    profile: joi.string().required().messages({
        "any.required": "Profile is required",
        "string.empty": "Profile is required"
    }),
    category: joi.string().required().messages({
        "any.required": "Category is required",
        "string.empty": "Category is required"
    }),
    shopName: joi.string().required().messages({
        "any.required": "Shop name is required",
        "string.empty": "Shop name is required"
    }),
    shopAddress: joi.string().required().messages({
        "any.required": "Shop address is required",
        "string.empty": "Shop address is required"
    }),
    shopLogo: joi.string().required().messages({
        "any.required": "Shop logo is required",
        "string.empty": "Shop logo is required"
    })
})
const userLoginSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.email": "Email is invalid",
        "any.required": "Email is required",
        "string.empty": "Email is required"
    }),
    password: joi.string().required().messages({
        "string.length": "Password must be at least 8 characters",
        "any.required": "Password is required",
        "string.empty": "Password is required"
    }).pattern(/[0-9]/).messages({
        "string.pattern.base": "Password must contain at least one number"
    }).pattern(/[A-Z]/).messages({
        "string.pattern.base": "Password must contain at least one uppercase letter"
    }).pattern(/[a-z]/).messages({
        "string.pattern.base": "Password must contain at least one lowercase letter"
    }).pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).messages({
        "string.pattern.base": "Password must contain at least one special character"
    }).pattern(/[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).messages({
        "string.pattern.base": "Password must contain at least one special character"
    })
})

export default { userRegisterationSchema, userLoginSchema } 