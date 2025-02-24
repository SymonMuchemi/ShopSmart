import Stripe from 'stripe';
import { getAwsSecrets } from '../config/secrets';
import { color } from 'console-log-colors';

export const initStripe = async () => {
    try {
        const { STRIPE_SECRET_KEY } = await getAwsSecrets();

        return new Stripe(STRIPE_SECRET_KEY);

    } catch (error: any) {
        console.error(color.red.bold(`Stripe initialization error: ${error.message}`));
    }
}
