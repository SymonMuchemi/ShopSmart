import { Request, Response } from "express";
import { makeIntent, processPayment as processCardPayment } from "../services/payment.service";
import { handleRequest } from "../utils";

const PAYMENT_INTENT_CREATION_ERROR = 'payment.controller: Error creating payment intent';
const PAYMENT_PROCESSING_ERROR = 'payment.controller: Error processing payment';

export const createIntent = async (req: Request, res: Response) => {
    const { amount } = req.body;

    await handleRequest(req, res, () => makeIntent(amount), PAYMENT_INTENT_CREATION_ERROR);
}
export const processPayment = async (req: Request, res: Response) => {
    const { cardNumber, exp_month, exp_year, cvc, amount, currency } = req.body;

    const paymentData = {
        cardNumber,
        exp_month,
        exp_year,
        cvc, 
        amount, 
        currency 
    }

    await handleRequest(req, res, () => processCardPayment(paymentData), PAYMENT_PROCESSING_ERROR);
}
