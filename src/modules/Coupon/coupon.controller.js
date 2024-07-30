import { APIFeatures } from "../../utils/api-features.js"
import { applyCouponValidation } from "../../utils/coupon.validation.js"

import CouponUser from "../../../DB/models/coupon-user.model.js"
import Coupon from "../../../DB/models/coupon.model.js"
import User from "../../../DB/models/user.model.js"

export const addCoupon = async (req, res, next) => {
    const { couponCode, couponAmount, isFixed, isPercentage, fromDate, toDate, users } = req.body
    // check that coupon code is duplicated
    const coupon = await Coupon.findOne({ couponCode })
    if (coupon) return next(new Error('Coupon code is duplicated', { cause: 400 }))
    // check that coupon amount is valid
    if(isFixed == isPercentage) return next(new Error('Coupon amount is not invalid', { cause: 400 }))
    if(isPercentage && couponAmount >= 100) return next(new Error('Coupon amount is not invalid', { cause: 400 }))
    // check that user exists
    const userIds = []
    for (const user of users) {
        userIds.push(user.userId)
    }
    const isUserExist = await User.find({_id: {$in:userIds}})
    if( isUserExist.length != users.length ) return next(new Error('User not found', { cause: 404 }))
    // create new document in database
    const newCoupon = await Coupon.create({
        couponCode,
        couponAmount,
        isFixed,
        isPercentage,
        fromDate,
        toDate,
        addedBy: req.authAdmin._id
    })
    // create coupon-users
    await CouponUser.create(
        users.map(ele => ({...ele, couponId: newCoupon._id}))
    )
    // send response
    res.status(201).json({
        msg: "Coupon added successfully",
        statusCode: 201,
    })
}

export const getAllCoupons = async (req, res, next) => {
    // destruct data from the user
    const {page, size} = req.query
    // get all coupons
    const features = new APIFeatures(req.query, CouponUser.find()
        .populate({path: "couponId", select:"couponCode couponAmount"})
        .select("couponCode couponAmount"))
        .pagination({ page, size })
    const coupons = await features.mongooseQuery
    if(!coupons.length) {
        return next(new Error("No coupons found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "Coupons fetched successfully",
        statusCode: 200,
        coupons
    })
}

export const getCouponByCode = async (req, res, next) => {
    // destruct data from the user
    const { couponCode } = req.query
    // get coupon
    const coupon = await Coupon.findOne({ couponCode }).select("couponCode couponAmount fromDate toDate addedBy")
    if(!coupon) return res.status(404).json({ msg: "Coupon not found" })
    // send response
    res.status(200).json({
        msg: "Coupon fetched successfully",
        statusCode: 200,
        coupon
    })
}

export const deleteCoupon = async (req, res, next) => {
    // destruct data from the user
    const { couponId } = req.params
    // check that coupon is found
    const coupon = await Coupon.findById({_id: couponId})
    if(!coupon) return next(new Error("Coupon not found", { cause: 404 }))
    // delete coupon
    await coupon.deleteOne()
    await CouponUser.deleteMany({couponId})
    // send response
    return res.status(200).json({ 
        msg: "Coupon deleted successfully",
        statusCode:200
    })
}

export const validateCoupon = async (req,res,next)=>{
    // destruct data from the user
    const {code} = req.body
    // check that coupon is found
    // applyCouponValidation
    const isCouponValid = await applyCouponValidation(code , req.authUser._id)
    if(isCouponValid.status){
        return res.status(isCouponValid.status).json({ msg: isCouponValid.msg, statusCode: isCouponValid.status })
    }
    // send response
    res.json({
        msg: "Coupon applied successfully",
        statusCode: 200
    })
}