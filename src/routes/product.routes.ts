import { Router } from "express";
import { asyncHandler } from "../utils";
import { createProductSchema } from "../middleware/validators/product.validator";
import { create, findAll, updateByName } from "../controller/product.controller";

const productsRouter = Router();

productsRouter.post('/new', createProductSchema, asyncHandler(create));
productsRouter.get('/', asyncHandler(findAll));
productsRouter.put('/', asyncHandler(updateByName));

export default productsRouter;
