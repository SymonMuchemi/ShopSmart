import { Request, Response } from "express";
import { handleRequest } from "../utils";
import { makePurchase, purchaseUsingCart, getUserPurchases } from "../services/purchase.service";

const RECORD_PURCHASE_ERROR_MSG = "purchase.controller: Error recording purchase";
const RECORD_PURCHASE_FROM_CART_ERROR_MSG = "purchase.controller: Error recording purchase from cart";
const GET_USER_PURCHASE_ERROR_MSG = "purchase.controller: Error fetching user purchase history";

export const purchase = async (req: Request, res: Response) => {
    const { userId, purchaseItems } = req.body;

    await handleRequest(req, res, () => makePurchase(userId, purchaseItems), RECORD_PURCHASE_ERROR_MSG);
}

export const purchaseFromCart = async (req: Request, res: Response) => {
    const { userId } = req.body;

    await handleRequest(req, res, () => purchaseUsingCart(userId), RECORD_PURCHASE_FROM_CART_ERROR_MSG);
}

export const getUserPurchaseRecord = async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 10;

    await handleRequest(req, res, () => getUserPurchases(userId, page, limit), GET_USER_PURCHASE_ERROR_MSG);
}
