import axios from "axios";
import { Purchase, User } from "../db/models"

const makePurchase = async (userId: string, purchaseId: string) => {
    try {
        const user = await User.findById(userId);
        const purchaseRecord = await Purchase.findById(purchaseId);

        if (!user) {
            throw new Error(`mpesa: Error finding user with id: ${userId}`);
        }

        if (!purchaseRecord) {
            throw new Error(`mpesa: Error finding purchase record with id: ${purchaseId}`);
        }

        const stkpushUrl = `http://localhost:${process.env.PORT}/api/v1/mpesa`
        const mpesaCallbackUrl = `${stkpushUrl}/callback`;

        // const pushresponse = await axios.post(url, {})

    } catch (error) {
        
    }
}
