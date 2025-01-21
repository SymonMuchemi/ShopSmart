import multer from 'multer';
import { Router } from "express";
import { asyncHandler, errorHandler } from "../utils";
import { createProductSchema } from "../middleware/validators/product.validator";
import { create, findAll, updateByName, deleteById, deleteImageLess } from "../controller/product.controller";

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage, limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const productsRouter = Router();

productsRouter.route('/')
    .get(asyncHandler(findAll))
    .put(asyncHandler(updateByName))
    .delete(asyncHandler(deleteImageLess));
productsRouter.route('/new')
    .post(upload.array('files'), createProductSchema, asyncHandler(create));
productsRouter.route('/:id')
    .delete(asyncHandler(deleteById));

productsRouter.use(errorHandler);
export default productsRouter;
