import { APIFeatures } from "../../utils/api-features.js";
import { applyCouponValidation } from "../../utils/coupon.validation.js";

import Book from "../../../DB/models/book.model.js";
import Plan from "../../../DB/models/plan.model.js";
import Room from "../../../DB/models/room.model.js";
import CouponUser from "../../../DB/models/coupon-user.model.js";

export const addBook = async (req, res, next) => {
    // destruct data from req.body
    const { roomId, planId, seats, date, startTime, endTime, paymentMethod, couponCode } = req.body;
    // check if user exists
    const user = await Book.findOne({userId: req.authUser._id, paymentstatus: "unpaid"});
    if (user) {
        return next(new Error("You already have an unpaid booking", { cause: 400 }));
    }
    const isRoom = await Room.findById(roomId);
    if (!isRoom) {
        return next(new Error("Room not found", { cause: 404 }));
    }
    const isPlan = await Plan.findById(planId);
    if (!isPlan) {
        return next(new Error("Plan not found", { cause: 404 }));
    }
    // check seats
    if (seats > isRoom.seats) {
        return next(new Error("Not enough seats", { cause: 400 }));
    }
    // coupon code check
    let coupon = null
    if(couponCode){
        const isCouponValid = await applyCouponValidation(couponCode, req.authUser._id);
        if(isCouponValid.status) return res.status(isCouponValid.status).json({ msg: isCouponValid.msg, statusCode: isCouponValid.status })
        coupon = isCouponValid;
    }
    const dateFormate = new Date(date);
    // cancellation deadline
    const cancellationDeadline = new Date(dateFormate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
    // calculate total price
    let totalPrice = seats * isPlan.price;
    if(coupon?.isFixed){
        totalPrice = totalPrice - coupon.couponAmount;
    }else if(coupon?.isPercentage){
        totalPrice = totalPrice - (totalPrice * coupon.couponAmount / 100);
    }
    // create new book 
    const newBook = new Book({
        roomId,
        planId,
        seats,
        date: dateFormate,
        startTime,
        endTime,
        branch: isRoom.branchId,
        paymentMethod,
        cancellationDeadline,
        totalPrice,
        couponId: coupon?._id,
        userId: req.authUser._id
    })
    // save book
    await newBook.save();
    // update coupon usage count
    if(newBook.couponId){
        const couponUser = await CouponUser.findOneAndUpdate({couponId: newBook.couponId}, {$inc: {usageCount: 1}})
    }
    // send response
    res.status(200).json({
        msg: "Booked successfully",
        statusCode: 200,
    })
}

export const getAllBooks = async (req, res, next) => {
    const {page, size, status} = req.query;
    // get all books
    const features = new APIFeatures(req.query, Book.find({userId: req.authUser._id, status: status || "upcomming"})
        .populate({path: "roomId", select:"name"})
        .select('date startTime seats paymentstatus totalPrice'))
        .pagination({ page, size })
    const books = await features.mongooseQuery
    if(!books.length) {
        return next(new Error("No books found", { cause: 404 }))
    }
    // send response
    res.status(200).json({
        msg: "Books fetched successfully",
        statusCode: 200,
        books
    })
}

export const cancelBook = async (req, res, next) => {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
        return next(new Error("Book not found", { cause: 404 }));
    }
    if (book.userId.toString() !== req.authUser._id.toString()) {
        return next(new Error("Unauthorized", { cause: 401 }));
    }
    const cancellationDeadline = new Date(book.cancellationDeadline);
    if(cancellationDeadline <= new Date()) {
        return next(new Error("Cancellation deadline exceeded", { cause: 400 }));
    }
    book.status = "cancelled";
    await book.save();
    res.status(200).json({
        msg: "Book cancelled successfully",
        statusCode: 200
    })
}