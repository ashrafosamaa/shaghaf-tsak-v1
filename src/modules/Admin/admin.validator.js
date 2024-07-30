import Joi from "joi";

export const loginValidator = {
    body: Joi.object({
        userName : Joi.string().required().min(5),
        password: Joi.string().required().min(8),
    })
}


export const updatePasswordValidator = {
    body: Joi.object({
        oldPassword: Joi.string().required().min(8),
        password: Joi.string().required().min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, "i")
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
        }),
        passwordConfirm: Joi.string().required().valid(Joi.ref('password')),
    })
}


export const createWorkerValidator = {
    body: Joi.object({
        userName : Joi.string().required().min(5),
        password: Joi.string().required().min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, "i")
        .messages({
            'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
        }),
        passwordConfirm: Joi.string().required().valid(Joi.ref('password')),
        role: Joi.string().required().valid('manager', 'staff'),
        salary: Joi.number().required(),
        branchId: Joi.string().length(24).hex().required()
    })
}


export const getAllWorkersValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
        sortBy: Joi.string().optional()
    })
}


export const IDValidator = {
    params: Joi.object({
        adminId: Joi.string().length(24).hex().required()
    })
}


export const updateSalary = {
    body: Joi.object({
        salary: Joi.number().required()
    }),
    params: Joi.object({
        adminId: Joi.string().length(24).hex().required()
    })
}


export const addDeduction = {
    body: Joi.object({
        amount: Joi.number().required()
    }),
    params: Joi.object({
        adminId: Joi.string().length(24).hex().required()
    })
}


export const addOverTime = {
    body: Joi.object({
        amount: Joi.number().required()
    }),
    params: Joi.object({
        adminId: Joi.string().length(24).hex().required()
    })
}


export const searchValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
        sortBy: Joi.string().optional(),
        userName: Joi.string().optional(),
    })
}