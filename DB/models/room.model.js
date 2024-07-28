import { Schema, model } from "mongoose";

const roomSchema = new Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    branch: {
        type: String,
        required: true,
        enum: ["Korba", "Dokki"]
    },
    description: {
        type: String,
        required: true,
    },
    amentities: [{
        title: {
            type: String,
        },
        desc: {
            type: String,
        }
    }],
    seats: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["Private", "Public"]
    },
    planId: {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        required: true
    },
    coverImg: {
        secure_url: { type: String },
        public_id: { type: String }
    },
    otherImgs: [
        {
            public_id: {type: String},
            secure_url: {type: String}
        }
    ],
    folderId: { type: String },

}, {timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})



const Room = model("Room", roomSchema);

export default Room;