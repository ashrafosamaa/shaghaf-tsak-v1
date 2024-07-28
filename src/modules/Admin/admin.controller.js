import { APIFeatures } from "../../utils/api-features.js";

import Admin from "../../../DB/models/admin.model.js";

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const login = async (req, res, next) => {
    // check Admin data in req.body
    const admin = await Admin.findOne({userName: req.body.userName});
    if (!admin) {
        return next(new Error("Incorrect Username", { cause: 404 }));
    }
    // check password
    const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password);
    if (!(isPasswordCorrect)) {
        return next(new Error("Incorrect Password", { cause: 404 }));
    }
    // generate token
    const adminToken = jwt.sign({ id: admin._id, userName: req.body.userName, role: admin.role },
        process.env.JWT_SECRET_LOGIN,
        {
            expiresIn: "90d"
        }
    )
    const adminName = admin.userName.split(" ")[0];
    // send response
    return res.status(200).json({
        msg: `Login Successfully, Welcome Mr/Ms. ${adminName}`, 
        statusCode: 200,
        adminToken
    });
}

export const updatePassword = async (req, res, next)=> {
    // destruct data from req.body
    const { oldPassword, password } = req.body
    const { _id } = req.authAdmin
    // check if admin exists
    const admin = await Admin.findById(_id)
    if(!admin){
        return next(new Error("Admin not found", { cause: 404 }));
    }
    // check if password is correct
    const isPasswordMatch = bcrypt.compareSync(oldPassword, admin.password)
    if(!isPasswordMatch){
        return next(new Error("Incorrect old password", { cause: 400 }));
    }
    // update password
    admin.password = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    // save admin
    await admin.save()
    // generate token
    const adminToken = jwt.sign({ id: admin._id, userName: admin.userName, role: admin.role },
        process.env.JWT_SECRET_LOGIN,
        {
            expiresIn: "90d"
        }
    ) 
    // send response
    res.status(200).json({
        msg: "Password updated successfully", 
        statusCode: 200,
        adminToken
    })
}

export const createWorker = async (req, res, next) => {
    // destruct data from ceo
    const { userName, password, role, salary, branch } = req.body
    // check if userNameExist exists
    const userNameExist = await Admin.findOne({ userName })
    if (userNameExist) return next (new Error ("User Name already exists", { cause: 409 }))
    // check role
    if (role == "admin") return next (new Error ("Invalid role, this platform has only one Admin", { cause: 400 }))
    // hash password
    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    // final salary
    const finalSalary = salary
    // create worker
    const worker = await Admin.create({
        userName,
        password: hashedPassword,
        role,
        salary,
        branch,
        finalSalary
    })
    if(!worker){
        return next(new Error('Error while adding new Worker', { cause: 500 }))
    }
    // send response
    res.status(201).json({
        msg: "Worker created successfully",
        statusCode: 201
    })
}

export const getAllWorkers = async (req, res, next) => {
    // destruct data from req.query
    const {_id} = req.authAdmin
    const { page, size, sortBy } = req.query;
    const features = new APIFeatures(req.query, Admin.find({_id: {$ne: _id}}).select("-password -createdAt -updatedAt -__v"))
        .pagination({ page, size })
        .sort(sortBy)
    const workers = await features.mongooseQuery
    if(!workers.length) {
        return next(new Error("No workers found", { cause: 404 }));
    }
    // send response
    res.status(200).json({
        msg: "Workers data fetched successfully", 
        statusCode: 200,
        workers
    })
}

export const getWorker = async (req, res, next) => {
    const worker = await Admin.findById(req.params.adminId).select("-password -createdAt -updatedAt -__v")
    if(!worker) {
        return next(new Error("Worker not found", { cause: 404 }));
    }
    // send response
    res.status(200).json({
        msg: "Worker data fetched successfully", 
        statusCode: 200,
        worker
    })
}

export const updateSalary = async (req, res, next)=> {
    // destruct data from req.body
    const { salary } = req.body
    // check if worker exists
    const worker = await Admin.findById(req.params.adminId)
    if(!worker){
        return next(new Error("worker not found", { cause: 404 }));
    }
    // update salary
    worker.salary = salary
    // save worker
    await worker.save()
    // send response
    res.status(200).json({
        msg: "Salary updated successfully", 
        statusCode: 200
    })
}

export const addDeduction = async (req, res, next)=> {
    // Destructure amount from req.body
    const { amount } = req.body;
    // Check if worker exists
    const worker = await Admin.findById(req.params.adminId);
    if (!worker) {
        return res.status(404).json({ msg: "Worker not found", statusCode: 404 });
    }
    // Calculate the new salary after deduction
    const salaryAfter = worker.finalSalary - amount;
    // Create the deduction object with current date
    const newDeduction = {
        amount,
        date: new Date(),
        salaryAfter
    };
    // Add the deduction to the worker's deductions array
    worker.deduction.push(newDeduction);
    worker.finalSalary -= amount
    // Save worker
    await worker.save();
    // Send response
    res.status(200).json({
        msg: "Deduction added successfully",
        statusCode: 200,
        newDeduction
    });
}

export const addOverTime = async (req, res, next)=> {
    // Destructure amount from req.body
    const { amount } = req.body;
    // Check if worker exists
    const worker = await Admin.findById(req.params.adminId);
    if (!worker) {
        return res.status(404).json({ msg: "Worker not found", statusCode: 404 });
    }
    // Calculate the new salary after bouns
    const salaryAfter = worker.finalSalary + amount;
    // Create the bouns object with current date
    const newBouns = {
        amount,
        date: new Date(),
        salaryAfter
    };
    // Add the bouns to the worker's overTime array
    worker.overTime.push(newBouns);
    worker.finalSalary += amount
    // Save worker
    await worker.save();
    // Send response
    res.status(200).json({
        msg: "Bouns added successfully",
        statusCode: 200,
        newBouns
    });
}

export const deleteWorker = async (req, res, next)=> {
    // destruct data from req.params
    const { adminId } = req.params
    // check if worker exists
    const worker = await Admin.findByIdAndDelete(adminId)
    if(!worker) {
        return next(new Error("Worker not found", { cause: 404 }));
    }
    // send response
    res.status(200).json({
        msg: "Worker deleted successfully",
        statusCode: 200
    })
}

export const search = async (req, res, next)=> {
    // destruct data from req.query
    const {page, size, sortBy, ...serach} = req.query
    const features = new APIFeatures(req.query, Admin.find().select("-password -createdAt -updatedAt -__v"))
    .pagination({page, size})
    .searchWorkers(serach)
    .sort(sortBy)
    const workers = await features.mongooseQuery
    if(!workers.length) {
        return next (new Error("No workers found matching with your search query", { cause: 404 }));
    }
    res.status(200).json({ 
        msg: "Workers fetched successfully", 
        statusCode: 200,
        workers
    })
}