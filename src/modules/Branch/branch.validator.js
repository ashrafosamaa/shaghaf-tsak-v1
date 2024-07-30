import Joi from "joi";

export const addBranchValidator = {
    body: Joi.object({
        name: Joi.string().required(), 
        locationLink: Joi.string().required(),
    }),
}


export const getAllBranchesValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
    })
}


export const IDValidator = {
    params: Joi.object({
        branchId: Joi.string().length(24).hex().required()
    })
}