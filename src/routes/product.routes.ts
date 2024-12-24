import { Router } from "express";
import { asyncHandler } from "../utils";
import { create } from "../controller/product.controller";
import { createProductSchema } from "../middleware/validators/product.validator";

const productsRouter = Router();

productsRouter.post('/new', createProductSchema, asyncHandler(create));

export default productsRouter;
