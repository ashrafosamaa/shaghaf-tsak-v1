import { Schema, model } from "mongoose";

const adminSchema = new Schema({
    userName: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "manager", "staff"]
    },
    salary: {
        type: Number,
        required: true
    },
    branch: {
        type: String,
        required: true,
        enum: ["Korba", "Dokki"]
    },
    finalSalary: {
        type: Number,
    },
    deduction:[{
        amount: {
            type: Number,
            default: 0
        },
        date: {
            type: Date,
        },
        salaryAfter: {
            type: Number,
        }
    }],
    overTime:[{
        amount: {
            type: Number,
            default: 0
        },
        date: {
            type: Date,
        },
        salaryAfter: {
            type: Number,
        }
    }],
    branch: {
        type: String,
    }

}, {timestamps: true,});

const Admin = model("Admin", adminSchema);

export default Admin;