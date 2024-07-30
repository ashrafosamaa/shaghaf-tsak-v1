import Joi from "joi";

export const addRoomValidator = {
    body: Joi.object({
        name: Joi.string().required(), 
        branchId: Joi.string().length(24).hex().required(),
        description: Joi.string().required(), 
        seats: Joi.number().required(), 
        type: Joi.string().required().valid("Private", "Public"),
    }),
}


export const getAllRoomsValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
    })
}


export const IDValidator = {
    params: Joi.object({
        roomId: Joi.string().length(24).hex().required()
    })
}


export const addAmentitieValidator = {
    params: Joi.object({
        roomId: Joi.string().length(24).hex().required()
    }),
    body: Joi.object({
        title: Joi.string().required(),
        desc: Joi.string().required()
    })
}


export const addPlanValidator = {
    params: Joi.object({
        roomId: Joi.string().length(24).hex().required()
    }),
    body: Joi.object({
        planId: Joi.string().length(24).hex().required()
    })
}


export const updateRoomValidator = {
    params: Joi.object({
        roomId: Joi.string().length(24).hex().required()
    }),
    body: Joi.object({
        name: Joi.string().optional(), 
        branch: Joi.string().optional().valid("Korba", "Dokki"), 
        description: Joi.string().optional(), 
        seats: Joi.number().optional(), 
        type: Joi.string().optional().valid("Private", "Public"),
    }),
}


export const searchValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
        name: Joi.string().optional(),
    })
}