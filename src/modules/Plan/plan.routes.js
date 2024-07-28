import { Router } from "express";
import { authAdmin } from "../../middlewares/auth-admin.middleware.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js"
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import * as planController from './plan.controller.js'
import * as validator from "./plan.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();


router.post('/', authAdmin(),
    multerMiddleHost({extensions: allowedExtensions.image
        }).single('cover'), validationMiddleware(validator.addPlanValidator),
expressAsyncHandler(planController.createPlan))

router.get('/', authAdmin(['admin', 'manager']), validationMiddleware(validator.getAllPlansValidator),
    expressAsyncHandler(planController.getAllPlans))

router.get('/byId/:planId', authAdmin(['admin', 'manager']), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(planController.getPlan))

router.put('/:planId', authAdmin(['admin', 'manager']), validationMiddleware(validator.updatePlanValidator),
    expressAsyncHandler(planController.updatePlan))

router.delete('/delete/:planId', authAdmin(['admin', 'manager']), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(planController.deletePlan))


export default router