import multer from 'multer';
import { Router } from "express";
import { Product } from '../db/models';
import advancedResults from '../middleware/advancedResults';
import { fileErrorHandler } from '../middleware/errrors';
import { createProductSchema } from "../middleware/validators/product.validator";
import { create, getProducts } from "../controller/product.controller";

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage, limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const productsRouter = Router();

productsRouter.route('/')
    .get(advancedResults(Product), getProducts)
    .post(upload.array('files'), createProductSchema, create);

// productsRouter.route('/:id')
//     .delete(asyncHandler(deleteById));

productsRouter.use(fileErrorHandler);
export default productsRouter;
