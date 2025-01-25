import { stripe } from './config';

export const createIntent = async (amount: number, currency: string = 'usd') => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount, currency
    })
}
