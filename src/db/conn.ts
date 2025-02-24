import mongoose from 'mongoose';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

import { color } from 'console-log-colors';

const secret_name = "shopsmart-secret-values";

const client = new SecretsManagerClient({ region: 'eu-north-1' });

let response;


export const connectDB = async () => {
    try {
        // fetch MongoDB URI from AWS Secrets Manager
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: 'AWSCURRENT'
            })
        );

        const secret = response.SecretString;

        console.log(color.yellowBright(secret))

        if (!secret) {
            console.log(color.red.inverse("SecretString is empty!!!"));
            process.exit(1);
        }

        const { MONGO_DB_URL } = JSON.parse(secret);

        if (!MONGO_DB_URL) {
            console.log(color.red.inverse('MONGO DB URL NOT FOUND IN SECRET!!!'))
        }

        const conn = await mongoose.connect(MONGO_DB_URL);

        console.log(color.blueBright(`MongoDB connected: ${conn.connection.host}`));
    } catch (error: any) {
        console.log(color.redBright(`Mongodb connection error: ${error.toString()}`))
    }
}
