import { Request, Response } from "express";
import { handleRequest } from "../utils";
import { makePurchase, purchaseUsingCart } from "../services/purchase.service";

const RECORD_PURCHASE_ERROR_MSG = "purchase.controller: Error recording purchase";
const RECORD_PURCHASE_FROM_CART_ERROR_MSG = "purchase.controller: Error recording purchase from cart";

export const purchase = async (req: Request, res: Response) => {
    const { userId, purchaseItems } = req.body;

    await handleRequest(req, res, () => makePurchase(userId, purchaseItems), RECORD_PURCHASE_ERROR_MSG);
}

export const purchaseFromCart = async (req: Request, res: Response) => {
    const {userId} = req.body;

    await handleRequest(req, res, () => purchaseUsingCart(userId), RECORD_PURCHASE_FROM_CART_ERROR_MSG);
}
