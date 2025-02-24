import { initStripe } from './config';

export const createIntent = async (amount: number, currency: string = 'usd') => {
    const stripe = await initStripe();

    if (!stripe) throw new Error('Stripe object not created');
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount, currency
    });

    return paymentIntent;
}
