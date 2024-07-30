import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    couponAmount: {
        type: Number,
        required: true,
        min:1
    },
    couponStatus: {
        type: String,
        default: "valid",
        enum: ["valid", "expired"]
    },


    isFixed: {
        type: Boolean,
        default: false
    },
    isPercentage: {
        type: Boolean,
        default: false
    },

    fromDate:{
        type: Date,
        required: true
    },
    toDate:{
        type: Date,
        required: true
    },

    addedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    updatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
},{timestamps: true});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon