import { Request, Response } from "express";
import { handleRequest } from "../utils";
import { makePurchase } from "../services/purchase.service";

const RECORD_PURCHASE_ERROR_MSG = "purchase.controller: Error recording purchase";

export const purchase = async (req: Request, res: Response) => {
    const { userId, purchaseItems } = req.body;

    await handleRequest(req, res, () => makePurchase(userId, purchaseItems), RECORD_PURCHASE_ERROR_MSG);
}
