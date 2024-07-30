import { Schema, model } from "mongoose";

const roomSchema = new Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: true
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
    planIds: [{
        type: Schema.Types.ObjectId,
        ref: "Plan",
        unique: true
    }],
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

})

const Room = model("Room", roomSchema);

export default Room;