import { Request, Response } from "express";
import { makeIntent } from "../services/payment.service";
import { handleRequest } from "../utils";

const PAYMENT_INTENT_CREATION_ERROR = 'payment.controller: Error creating payment intent';

export const createIntent = async (req: Request, res: Response) => {
    const { amount } = req.body;

    await handleRequest(req, res, () => makeIntent(amount), PAYMENT_INTENT_CREATION_ERROR);
}
