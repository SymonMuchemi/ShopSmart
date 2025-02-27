import multer from 'multer';
import { Router } from "express";
import { Product } from '../db/models';
import advancedResults from '../middleware/advancedResults';
import { fileErrorHandler } from '../middleware/errrors';
import { createProductSchema } from "../middleware/validators/product.validator";
import { addProductPhoto, create, deleteProduct, getProducts, updateProduct } from "../controller/product.controller";

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage, limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const productsRouter = Router();

productsRouter.route('/')
    .post(upload.array('files'), createProductSchema, create)
    .get(advancedResults(Product), getProducts);

productsRouter.route('/:id')
    .put(updateProduct)
    .delete(deleteProduct);

productsRouter.route('/:id/photos')
    .put(upload.array('files'), addProductPhoto);

productsRouter.use(fileErrorHandler);
export default productsRouter;
