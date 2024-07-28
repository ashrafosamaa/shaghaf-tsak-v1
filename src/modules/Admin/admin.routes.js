import { Router } from "express";
import { authAdmin } from "../../middlewares/auth-admin.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import * as adminController from './admin.controller.js'
import * as validator from "./admin.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();

router.post('/login', validationMiddleware(validator.loginValidator),
    expressAsyncHandler(adminController.login))

router.patch('/update-password', authAdmin(), validationMiddleware(validator.updatePasswordValidator),
    expressAsyncHandler(adminController.updatePassword))

router.post('/add-worker', authAdmin(), validationMiddleware(validator.createWorkerValidator),
    expressAsyncHandler(adminController.createWorker))

router.get('/workers', authAdmin(['admin', 'manager']), validationMiddleware(validator.getAllWorkersValidator),
    expressAsyncHandler(adminController.getAllWorkers))

router.get('/worker/:adminId', authAdmin(['admin', 'manager']), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(adminController.getWorker))

router.patch('/salary/:adminId', authAdmin(['admin', 'manager']), validationMiddleware(validator.updateSalary),
    expressAsyncHandler(adminController.updateSalary))

router.post('/deduction/:adminId', authAdmin(['admin', 'manager']), validationMiddleware(validator.addDeduction),
    expressAsyncHandler(adminController.addDeduction))

router.post('/over-time/:adminId', authAdmin(['admin', 'manager']), validationMiddleware(validator.addDeduction),
    expressAsyncHandler(adminController.addOverTime))

router.delete('/worker/:adminId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(adminController.deleteWorker))

router.get('/search', authAdmin(['admin', 'manager']), validationMiddleware(validator.searchValidator),
    expressAsyncHandler(adminController.search))


export default router