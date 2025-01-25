import { createIntent } from "../stripe/utils";

export const makeIntent = async (amount: number ) => {
    try {
        const purchaseIntent = await createIntent(amount);

        return {
            code: 200,
            message: 'Purchase intent made',
            details: purchaseIntent
        }
    } catch (error: any) {
        return {
            code: 500, 
            message: "Failed to create purchase intent",
            details: error.message
        }
    }
}
