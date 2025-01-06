import { createCartItem } from "../db/utils";
import { ICart, ICartItem, IProduct } from "../types";

export const addToCart = async (userId: string, product: IProduct) => {
    try {
        const cartItem = await createCartItem(userId, product);

        if (!cartItem) {
            return {
                code: 400,
                message: 'cart.service: could not create cart item',
                details: 'db.utils.createCartItem returned null'
            }
        }

        return {
            code: 201,
            message: 'item added to cart successfully',
            details: cartItem
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'cart.service: error adding item to cart',
            details: error.toString()
        }
    }
}
