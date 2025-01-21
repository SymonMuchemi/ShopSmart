import { Router } from "express";
import { asyncHandler } from "../utils";
import { addProductToCart, removeFromCart, updateQuantity } from "../controller/cart.controller";


const cartRouter = Router();

cartRouter.route('/')
    .post(asyncHandler(addProductToCart))
    .put(asyncHandler(updateQuantity))

cartRouter.route('/:id')
    .delete(asyncHandler(removeFromCart));

export default cartRouter;
