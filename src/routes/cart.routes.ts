import { Router } from "express";
import { asyncHandler } from "../utils";
import { addProductToCart } from "../controller/cart.controller";


const cartRouter = Router();

cartRouter.post('/add', asyncHandler(addProductToCart));

export default cartRouter;
