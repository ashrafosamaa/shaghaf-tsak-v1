import { Router } from "express";
import { authAdmin } from "../../middlewares/auth-admin.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.middleware.js";

import * as roomController from './room.controller.js'
import * as validator from "./room.validator.js"

import expressAsyncHandler from "express-async-handler";
import { allowedExtensions } from "../../utils/allowed-extensions.js";

const router = Router();


router.post('/', authAdmin(), multerMiddleHost({
    extensions: allowedExtensions.image
}).fields([{ name: 'cover', maxCount: 1 }, { name: 'otherImgs', maxCount: 4 }]),
    validationMiddleware(validator.addRoomValidator),
    expressAsyncHandler(roomController.addRoom))

router.get('/', validationMiddleware(validator.getAllRoomsValidator),
    expressAsyncHandler(roomController.getAllRooms))

router.get('/single/:roomId', validationMiddleware(validator.IDValidator),
    expressAsyncHandler(roomController.getRoomById))

router.put('/:roomId', authAdmin(), validationMiddleware(validator.updateRoomValidator),
    expressAsyncHandler(roomController.updateRoom))

router.delete('/:roomId', authAdmin(), validationMiddleware(validator.IDValidator),
    expressAsyncHandler(roomController.deleteRoom))

router.get('/search', validationMiddleware(validator.searchValidator),
    expressAsyncHandler(roomController.search))


export default router