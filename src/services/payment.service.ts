import { createIntent } from "../stripe/utils";
import { initStripe } from "../stripe/config";

interface PaymentRequest {
    cardNumber: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
    amount: number;
    currency?: string;
}


export const makeIntent = async (amount: number) => {
    try {
        const purchaseIntent = await createIntent(amount);

        return {
            code: 200,
            message: 'Purchase intent made',
            details: {
                clientSecret: purchaseIntent.client_secret
            }
        }
    } catch (error: any) {
        return {
            code: 500,
            message: "Failed to create purchase intent",
            details: error.message
        }
    }
}

export const processPayment = async (paymentData: PaymentRequest) => {
    try {
        const { cardNumber, exp_month, exp_year, cvc, amount, currency } = paymentData;

        const stripe = await initStripe();

        if (!stripe) throw new Error('Stripe object not created');

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: cardNumber,
                exp_month, exp_year,
                cvc
            },
        });

        // create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount, currency: currency || 'usd',
            payment_method: paymentMethod.id,
            confirm: true,
            payment_method_types: ['card'],
            automatic_payment_methods: {
                enabled: false
            }
        });

        return {
            code: 200,
            message: 'Payment process successfully',
            details: {
                success: true,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status
            }
        }
    } catch (error: any) {
        return {
            code: 500,
            message: "Failed to create purchase intent",
            details: error.message
        }
    }
}
