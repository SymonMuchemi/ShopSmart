import { Router } from "express";
import { asyncHandler } from "../utils";
import { createProductSchema } from "../middleware/validators/product.validator";
import { authenticateToken, authorizeAdmin } from "../middleware/authToken.middleware";
import { create, findAll, updateByName, deleteById } from "../controller/product.controller";

const productsRouter = Router();

productsRouter.post('/new', createProductSchema, asyncHandler(create));
productsRouter.get('/', authenticateToken, authorizeAdmin, asyncHandler(findAll));
productsRouter.put('/', authenticateToken, authorizeAdmin, asyncHandler(updateByName));
productsRouter.delete('/delete/:id', asyncHandler(deleteById));

export default productsRouter;
