import { Router } from "express";
import { asyncHandler } from "../utils";
import { create, findAll } from "../controller/product.controller";
import { createProductSchema } from "../middleware/validators/product.validator";

const productsRouter = Router();

productsRouter.post('/new', createProductSchema, asyncHandler(create));
productsRouter.get('/', asyncHandler(findAll));

export default productsRouter;
