import multer from 'multer';
import { Router } from "express";
import { asyncHandler } from "../utils";
import { createProductSchema } from "../middleware/validators/product.validator";
import { create, findAll, updateByName, deleteById } from "../controller/product.controller";

const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

const productsRouter = Router();

productsRouter.post('/new', upload.array('files'), createProductSchema, asyncHandler(create));
productsRouter.get('/', asyncHandler(findAll));
productsRouter.put('/', asyncHandler(updateByName));
productsRouter.delete('/delete/:id', asyncHandler(deleteById));

export default productsRouter;
