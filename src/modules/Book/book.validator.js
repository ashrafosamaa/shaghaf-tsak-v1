import Joi from "joi";

export const addBookValidator = {
    body: Joi.object({
        roomId: Joi.string().length(24).hex().required(), 
        planId: Joi.string().length(24).hex().required(),
        seats: Joi.number().required(), 
        date: Joi.date().greater(Date.now()-(24*60*60*1000)).required(), 
        startTime: Joi.string().required(), 
        endTime: Joi.string().required(), 
        paymentMethod: Joi.string().required().valid("cash", "card"),
        couponCode: Joi.string().optional()
    }),
}


export const getAllBooksValidator = {
    query: Joi.object({
        page: Joi.number().optional(),
        size: Joi.number().optional(),
        status: Joi.string().optional().valid("upcomming", "past", "cancelled"),
    })
}


export const cancelBookValidator = {
    params: Joi.object({
        bookId: Joi.string().length(24).hex().required()
    }),
}