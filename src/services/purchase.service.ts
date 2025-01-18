import { ReturnResponse } from "../types";
import { PurchaseItem } from "../types/models.types";
import { checkoutCart, recordPurchase, getUserPurchaseHistory } from "../db/utils";


export const makePurchase = async (userId: string, purchaseItems: PurchaseItem[]): Promise<ReturnResponse> => {
    try {
        const purchaseRecord = await recordPurchase(userId, purchaseItems);

        if (!purchaseRecord) {
            return {
                code: 400,
                message: 'purchase.service: could not record purchase',
                details: 'db.utils.recordPurchase returned null'
            }
        }

        return {
            code: 201,
            message: 'purchase recorded successfully',
            details: purchaseRecord
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'purchase.service: error making purchase',
            details: error.toString()
        }
    }
}

export const purchaseUsingCart = async (userId: string) => {
    try {
        const cartItems = await checkoutCart(userId);

        return {
            code: 200,
            message: 'just in the testing phase',
            details: cartItems
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'purchase.service: error making purchase',
            details: error.toString()
        }
    }
}

export const getUserPurchases = async (userId: string, page: number = 1, limit: number = 10) => {
    try {
        const purchases = await getUserPurchaseHistory(userId, page, limit);

        return {
            code: 200,
            message: `Records found: ${purchases.metadata.total_items}`,
            details: purchases
        }
    } catch (error: any) {
        return {
            code: 200,
            message: "Error deleting products",
            details: error.toString()
        }
    }
}
