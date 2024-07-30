import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { authAdmin } from "../../middlewares/auth-admin.middleware.js";
import { authUser } from "../../middlewares/auth-user.middleware.js";

import * as couponController from "./coupon.controller.js"
import * as validator from "./coupon.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();


router.post('/', authAdmin(['admin', 'manager']), validationMiddleware(validator.addCouponSchema),
    expressAsyncHandler(couponController.addCoupon))

router.get('/', authAdmin(['admin', 'manager']), validationMiddleware(validator.getAllCouponsSchema),
    expressAsyncHandler(couponController.getAllCoupons))

router.get('/byId/', authAdmin(['admin', 'manager']), validationMiddleware(validator.getCouponByCodeSchema),
    expressAsyncHandler(couponController.getCouponByCode))

router.delete('/:couponId', authAdmin(['admin', 'manager']), validationMiddleware(validator.deleteCouponSchema),
    expressAsyncHandler(couponController.deleteCoupon))

router.post('/validateCoupon', authUser(), validationMiddleware(validator.validateCouponSchema),
    expressAsyncHandler(couponController.validateCoupon))


export default router;