import { APIFeatures } from "../../utils/api-features.js";
import { generateUniqueString } from "../../utils/generate-unique-string.js";

import Room from "../../../DB/models/room.model.js";
import Plan from "../../../DB/models/plan.model.js";

import cloudinaryConnection from "../../utils/cloudinary.js";

export const addRoom = async (req, res, next)=> {
    // destruct data from req.body
    const {name, branch, description, seats, type} = req.body
    if(!req.files.cover){
    // check Imgs
        return next(new Error('Cover Image is required', { cause: 400 }))
    }
    if(!req.files.otherImgs?.length){
        return next(new Error('Other Imags are required', { cause: 400 }))
    }
    // cover image
    let coverImg
    const folderId = generateUniqueString(4)
    const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.files.cover[0].path, {
        folder: `${process.env.MAIN_FOLDER}/Rooms/${folderId}/Cover`
    })
    coverImg = { secure_url, public_id }
    // otherImgs 
    let otherImgs = []
    for (const file of req.files.otherImgs) {
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(file.path, {
            folder: `${process.env.MAIN_FOLDER}/Rooms/${folderId}/OtherotherImgs`
        })
        otherImgs.push({ secure_url, public_id })
    }
    const newRoom = { name, branch, description, seats, type, coverImg, otherImgs, folderId }
    const roomCreated = (await Room.create(newRoom))
    if (!roomCreated) {
        return next(new Error('Error while adding Room', { cause: 500 }))
    }
    // send response
    res.status(201).json({
        msg: "Room created successfully",
        statusCode: 201
    })
}

export const getAllRooms = async (req, res, next)=> {
    // destruct data from req.query
    const {page, size} = req.query;
    const features = new APIFeatures(req.query, Room.find().select("coverImg.secure_url name"))
        .pagination({ page, size })
    const rooms = await features.mongooseQuery
    if(!rooms.length) {
        return next(new Error("No rooms found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "Rooms data fetched successfully", 
        statusCode: 200,
        rooms
    })
}

export const getRoomById = async (req, res, next)=> {
    // destruct data from req.params
    const {roomId} = req.params
    const room = await Room.findById(roomId)
    .populate({path:"planIds", select:"stamp price"})
    .select("-createdAt -updatedAt -__v -folderId -coverImg.public_id -otherImgs.public_id")
    if(!room) {
        return next(new Error('Room not found', { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "Room data fetched successfully",
        statusCode: 200,
        room
    })
}

export const addAmentitie = async (req, res, next)=> {
    // destruct data from req.body
    const {title, desc} = req.body
    // update
    const roomUpdated = await Room.findById(req.params.roomId)
    .populate({path:"planIds", select:"stamp price"})
    .select("-createdAt -updatedAt -__v -folderId -coverImg.public_id -otherImgs.public_id")
    if (!roomUpdated) {
        return next(new Error('Error while updating Room', { cause: 500 }))
    }
    // add amentities
    const newAmentitie = {
        title,
        desc
    }
    roomUpdated.amentities.push(newAmentitie)
    // save
    await roomUpdated.save()
    // send response
    res.status(200).json({
        msg: "Amentitie added successfully",
        statusCode: 200,
        roomUpdated
    })
}

export const addPlan = async (req, res, next)=> {
    // destruct data from req.body
    const {planId} = req.body
    // update
    const roomUpdated = await Room.findById(req.params.roomId)
    if (!roomUpdated) {
        return next(new Error('Error while updating Room', { cause: 500 }))
    }
    const plan = await Plan.findById(req.body.planId)
    if (!plan) {
        return next(new Error('Plan not found', { cause: 404 }))
    }
    roomUpdated.planIds.push(planId)
    // save
    await roomUpdated.save()
    // send response
    res.status(200).json({
        msg: "Plan added successfully",
        statusCode: 200,
    })
}

export const updateRoom = async (req, res, next)=> {
    // destruct data from req.body
    const roomUpdated = await Room.findByIdAndUpdate(req.params.roomId, req.body, {new: true})
    .populate({path:"planIds", select:"stamp price"})
    .select("-createdAt -updatedAt -__v -folderId -coverImg.public_id -otherImgs.public_id")
    if (!roomUpdated) {
        return next(new Error('Error while updating Room', { cause: 500 }))
    }
    // send response
    res.status(200).json({
        msg: "Room updated successfully",
        statusCode: 200,
        roomUpdated
    })
}

export const deleteRoom = async (req, res, next)=> {
    // destruct data from req.params
    const {roomId} = req.params
    const roomDeleted = await Room.findByIdAndDelete(roomId)
    if (!roomDeleted) {
        return next(new Error('Error while deleting Room', { cause: 500 }))
    }
    // delete photos
    const folder = `${process.env.MAIN_FOLDER}/Rooms/${roomDeleted.folderId}`
    await cloudinaryConnection().api.delete_resources_by_prefix(folder)
    await cloudinaryConnection().api.delete_folder(folder)
    // send response
    res.status(200).json({
        msg: "Room deleted successfully",
        statusCode: 200
    })
}

export const search = async (req, res, next)=> {
    // destruct data from req.query
    const { page, size, ...serach } = req.query;
    const features = new APIFeatures(req.query, Room.find().select("coverImg.secure_url name"))
    .searchRooms(serach)
    const rooms = await features.mongooseQuery
    if(!rooms.length) {
        return next(new Error('No Rooms found', { cause: 404 }))
    }
    res.status(200).json({
        msg: "Rooms fetched successfully",
        statusCode: 200,
        rooms 
    })
}