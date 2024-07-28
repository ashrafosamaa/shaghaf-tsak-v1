import Joi from "joi";

export const addRoomValidator = {
    body: Joi.object({
        name: Joi.string().required(), 
        branch: Joi.string().required().valid("Korba", "Dokki"), 
        description: Joi.string().required(), 
        seats: Joi.number().required(), 
        type: Joi.string().required().valid("Private", "Public"),
        planId: Joi.string().required().length(24).hex(),
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
        planId: Joi.string().optional().length(24).hex(),
    }),
}


export const searchValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
        name: Joi.string().optional(),
    })
}