import { Request, Response } from "express";
import { handleRequest } from "../utils";
import { addToCart } from "../services/cart.service";

const ADD_TO_CART_ERROR_MSG = "cart.controller: Error adding item to cart"

export const addProductToCart = async (req: Request, res: Response) => {
    const { product, userId } = req.body;

    await handleRequest(req, res, () => addToCart(userId, product), ADD_TO_CART_ERROR_MSG);
}
