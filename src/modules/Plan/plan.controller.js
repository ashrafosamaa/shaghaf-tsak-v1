import { APIFeatures } from '../../utils/api-features.js'
import { generateUniqueString } from '../../utils/generate-unique-string.js'

import Plan from '../../../DB/models/plan.model.js'

import cloudinaryConnection from '../../utils/cloudinary.js'

export const createPlan = async (req, res, next) => {
    // destruct data from ceo
    const { stamp, price } = req.body
    // upload image
    if(!req.file){
    // check Imgs
        return next(new Error('Cover Image is required', { cause: 400 }))
    }
    let coverImg
    const folderId = generateUniqueString(4)
    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: `${process.env.MAIN_FOLDER}/Plans/${folderId}`
    })
    coverImg = { secure_url, public_id }
    // create Plan
    const plan = await Plan.create({
        stamp,
        price,
        coverImg,
        folderId
    })
    if(!plan){
        return next(new Error('Error while adding new Plan', { cause: 500 }))
    }
    // send response
    res.status(201).json({
        msg: "Plan created successfully",
        statusCode: 201
    })
}

export const getAllPlans = async (req, res, next) => {
    const {page, size} = req.query;
    const features = new APIFeatures(req.query, Plan.find().select("-__v -createdAt -updatedAt -folderId"))
        .pagination({ page, size })
    const plans = await features.mongooseQuery
    if(!plans.length) {
        return next(new Error("No plans found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "Plans data fetched successfully", 
        statusCode: 200,
        plans
    })
}

export const getPlan = async (req, res, next) => {
    const plan = await Plan.findById(req.params.planId).select("-__v -createdAt -updatedAt -folderId")
    if(!plan) {
        return next(new Error("Plan not found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "Plan data fetched successfully", 
        statusCode: 200,
        plan
    })
}

export const updatePlan = async (req, res, next) => {
    const plan = await Plan.findByIdAndUpdate(req.params.planId, req.body, {new: true}).select("-__v -createdAt -updatedAt -folderId")
    if(!plan) {
        return next(new Error("Plan not found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "Plan updated successfully", 
        statusCode: 200,
        plan
    })
}

export const deletePlan = async (req, res, next) => {
    const plan = await Plan.findByIdAndDelete(req.params.planId)
    if(!plan) {
        return next(new Error("Plan not found", { cause: 404 }))
    }
    // delete photo
    const folder = `${process.env.MAIN_FOLDER}/Plans/${plan.folderId}`
    await cloudinaryConnection().api.delete_resources_by_prefix(folder)
    await cloudinaryConnection().api.delete_folder(folder)
    // send response
    res.status(200).json({
        msg: "Plan deleted successfully", 
        statusCode: 200
    })
}