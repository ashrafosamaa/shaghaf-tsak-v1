import { Schema, model } from "mongoose";

const branchSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    locationLink: {
        type: String,
        required: true,
    },

}, {timestamps: true,

})

const Branch = model("Branch", branchSchema);

export default Branch;