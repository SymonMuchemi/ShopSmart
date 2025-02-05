import axios from "axios";
import { Purchase, User } from "../db/models";
import { color } from "console-log-colors";

export const makePurchase = async (userId: string, purchaseId: string) => {
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
        const confirmPayUrl = `${stkpushUrl}/confirm`;

        const paymentRequestBody = {
            phone: user.phone,
            amount: purchaseRecord.total_amount
        }

        const pushresponse = await axios.post(stkpushUrl, paymentRequestBody);

        const CheckoutRequestID = pushresponse.data.data.CheckoutRequestID;
        console.log(color.yellow(`CheckoutRequestID: ${CheckoutRequestID}`));

        if (pushresponse.status !== 201) {
            throw new Error('Could not send STK push');
        }

        const confirmPayResponse = await axios.post(confirmPayUrl, { CheckoutRequestID });


        console.log(color.yellow("Confirming pay!"));
        console.log(color.blue.bold(confirmPayResponse));

        // await purchaseRecord.save();

        return pushresponse;

    } catch (error) {
        if (error instanceof Error) {
            console.error('Error making STK push request:', error.message);
        } else {
            console.error('Unknown error making STK push request');
        }
        throw Error;
    }
}
