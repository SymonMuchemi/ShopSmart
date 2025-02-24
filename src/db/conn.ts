import mongoose from 'mongoose';
import { getAwsSecrets } from '../config/secrets';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

import { color } from 'console-log-colors';

const secret_name = "shopsmart-secret-values";

const client = new SecretsManagerClient({ region: 'eu-north-1' });

let response;


export const connectDB = async () => {
    try {
        // fetch MongoDB URI from AWS Secrets Manager

        const { MONGO_DB_URL } = await getAwsSecrets();

        if (!MONGO_DB_URL) {
            console.log(color.red.inverse('MONGO DB URL NOT FOUND IN SECRET!!!'))
        }

        console.log(`Mongo db url string: ${MONGO_DB_URL}`)

        const conn = await mongoose.connect(MONGO_DB_URL);

        console.log(color.blueBright(`MongoDB connected: ${conn.connection.host}`));
    } catch (error: any) {
        console.log(color.redBright(`Mongodb connection error: ${error.toString()}`))
    }
}
