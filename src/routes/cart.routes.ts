import { Router } from "express";
import { asyncHandler } from "../utils";
import { addProductToCart, removeFromCart, updateQuantity } from "../controller/cart.controller";


const cartRouter = Router();

cartRouter.delete('/remove/:itemId', asyncHandler(removeFromCart));

cartRouter.route('/')
    .post(asyncHandler(addProductToCart))
    .put(asyncHandler(updateQuantity))

export default cartRouter;
