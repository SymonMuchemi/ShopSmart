import { Router } from "express";
import { asyncHandler } from "../utils";
import { createIntent } from "../controller/payment.controller";

const paymentRouter = Router();

paymentRouter.route('/create-payment-intent').post(asyncHandler(createIntent));

export default paymentRouter;
