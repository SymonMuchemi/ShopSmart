import { Router } from "express";
import { asyncHandler } from "../utils";
import { createIntent, processPayment } from "../controller/payment.controller";

const paymentRouter = Router();

paymentRouter.route('/create-payment-intent').post(asyncHandler(createIntent));
paymentRouter.route('/process-payment').post(asyncHandler(processPayment));

export default paymentRouter;
