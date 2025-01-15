import mongoose from "mongoose";
import { recordPurchase } from "../db/utils";
import { ReturnResponse } from "../types";
import { PurchaseItem } from "../types/models.types";


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
