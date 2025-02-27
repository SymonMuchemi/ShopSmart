import multer from 'multer';
import { Router } from "express";
import { fileErrorHandler } from '../middleware/errrors';
import { createProductSchema } from "../middleware/validators/product.validator";
import { create } from "../controller/product.controller";

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage, limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const productsRouter = Router();

productsRouter.route('/')
    .post(upload.array('files'), createProductSchema, create);

// productsRouter.route('/:id')
//     .delete(asyncHandler(deleteById));

productsRouter.use(fileErrorHandler);
export default productsRouter;
