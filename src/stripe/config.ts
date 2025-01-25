import Stripe from 'stripe';

const STRIPE_SECRET_KEY: string | undefined = process.env.STRIPE_SECRET_KEY;

if (STRIPE_SECRET_KEY === undefined) {
    throw new Error('Stripe: secret key not defined!')
} 

export const stripe = new Stripe(STRIPE_SECRET_KEY);
