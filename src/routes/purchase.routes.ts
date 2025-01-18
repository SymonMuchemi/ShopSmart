import { Router } from "express";
import { asyncHandler } from "../utils";
import { purchase, purchaseFromCart, getUserPurchaseRecord } from "../controller/purchase.controller";

const purchaseRouter = Router();

purchaseRouter.post('/new', asyncHandler(purchase));
purchaseRouter.post('/checkout-cart', asyncHandler(purchaseFromCart));
purchaseRouter.get('/:userId', asyncHandler(getUserPurchaseRecord));

export default purchaseRouter;
