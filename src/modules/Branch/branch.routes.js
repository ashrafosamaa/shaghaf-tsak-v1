import { Router } from "express";
import { authAdmin } from "../../middlewares/auth-admin.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import * as branchController from './branch.controller.js'
import * as validator from "./branch.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();


router.post('/', authAdmin(), validationMiddleware(validator.addBranchValidator),
    expressAsyncHandler(branchController.createBranch))

router.get('/', validationMiddleware(validator.getAllBranchesValidator),
    expressAsyncHandler(branchController.getAllBranches))

router.get('/byId/:branchId', validationMiddleware(validator.IDValidator),
    expressAsyncHandler(branchController.getBranch))

router.delete('/delete/:branchId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(branchController.deleteBranch))


export default router