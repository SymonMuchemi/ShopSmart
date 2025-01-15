import { Router } from "express";
import { asyncHandler } from "../utils";
import { purchase } from "../controller/purchase.controller";

const purchaseRouter = Router();

purchaseRouter.post('/new', asyncHandler(purchase));

export default purchaseRouter;
