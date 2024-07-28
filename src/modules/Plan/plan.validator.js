import Joi from "joi";

export const addPlanValidator = {
    body: Joi.object({
        stamp: Joi.string().required().valid('Day', 'Week', 'Month', 'Year'), 
        price: Joi.number().required(),
    }),
}


export const getAllPlansValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
    })
}


export const updatePlanValidator = {
    body: Joi.object({
        stamp: Joi.string().optional().valid('Day', 'Week', 'Month', 'Year'), 
        price: Joi.number().optional(),
    }),
    params: Joi.object({
        planId: Joi.string().length(24).hex().required()
    })
}


export const IDValidator = {
    params: Joi.object({
        planId: Joi.string().length(24).hex().required()
    })
}