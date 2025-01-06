import { Router } from "express";
import { asyncHandler } from "../utils";
import { addProductToCart, updateQuantity } from "../controller/cart.controller";


const cartRouter = Router();

cartRouter.post('/add', asyncHandler(addProductToCart));
cartRouter.put('/update', asyncHandler(updateQuantity));

export default cartRouter;
