import { Router } from "express";
import { authUser } from "../../middlewares/auth-user.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

import * as bookController from './book.controller.js'
import * as validator from "./book.validator.js"

import expressAsyncHandler from "express-async-handler";

const router = Router();

router.post('/', authUser(), validationMiddleware(validator.addBookValidator),
    expressAsyncHandler(bookController.addBook))

router.get('/', authUser(), validationMiddleware(validator.getAllBooksValidator),
    expressAsyncHandler(bookController.getAllBooks))

router.patch('/:bookId', authUser(), validationMiddleware(validator.cancelBookValidator),
    expressAsyncHandler(bookController.cancelBook))


export default router