import { APIFeatures } from '../../utils/api-features.js'

import Branch from '../../../DB/models/branch.model.js'

export const createBranch = async (req, res, next) => {
    // destruct data from ceo
    const { name, locationLink } = req.body
    // create branch
    const branch = await Branch.create({
        name,
        locationLink
    })
    if(!branch){
        return next(new Error('Error while adding new Branch', { cause: 500 }))
    }
    // send response
    res.status(201).json({
        msg: "Branch created successfully",
        statusCode: 201
    })
}

export const getAllBranches = async (req, res, next) => {
    const {page, size} = req.query;
    const features = new APIFeatures(req.query, Branch.find().select("-__v -createdAt -updatedAt"))
        .pagination({ page, size })
    const branch = await features.mongooseQuery
    if(!branch.length) {
        return next(new Error("No branch found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "Branch data fetched successfully", 
        statusCode: 200,
        branch
    })
}

export const getBranch = async (req, res, next) => {
    const branch = await Branch.findById(req.params.branchId).select("-__v -createdAt -updatedAt -folderId")
    if(!branch) {
        return next(new Error("Branch not found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "Branch data fetched successfully", 
        statusCode: 200,
        branch
    })
}

export const deleteBranch = async (req, res, next) => {
    const branch = await Branch.findByIdAndDelete(req.params.branchId)
    if(!branch) {
        return next(new Error("Branch not found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "Branch deleted successfully", 
        statusCode: 200
    })
}