import { Schema, model } from "mongoose";

const planSchema = new Schema({
    stamp: {
        type: String,
        required: true,
        enum: ['Day', 'Week', 'Month', 'Year']
    },
    price: { type: Number, required: true },
    coverImg: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    folderId: { type: String },

}, {timestamps: true,
})

const Plan = model("Plan", planSchema);

export default Plan;