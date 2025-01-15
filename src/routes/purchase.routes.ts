import { Router } from "express";
import { asyncHandler } from "../utils";
import { purchase, purchaseFromCart } from "../controller/purchase.controller";

const purchaseRouter = Router();

purchaseRouter.post('/new', asyncHandler(purchase));
purchaseRouter.post('/checkout-cart', asyncHandler(purchaseFromCart));

export default purchaseRouter;
