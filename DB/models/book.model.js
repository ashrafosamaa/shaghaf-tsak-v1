import { Schema, model } from "mongoose";

const bookSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    planId: {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },

    branch: {
        type: String,
        required: true,
        enum: ["Korba", "Dokki"]
    },
    seats: {
        type: Number,
        required: true
    },


    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },

    cancellationDeadline: {
        type: String,
        required: true
    },

    totalPrice: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["cash", "card"],
        
    },
    paymentstatus: {
        type: String,
        enum: ["unpaid", "paid"],
        default: "unpaid"
    },
    status: {
        type: String,
        enum: ["upcomming", "past", "cancelled"],
        default: "upcomming"
    }

}, {timestamps: true,

})


const Book = model("Book", bookSchema);

export default Book;