import { handleSecretManagerError } from '../utils/errorHandlers';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const secret_name = "shopsmart-secret-values";

const client = new SecretsManagerClient({ region: 'eu-north-1' });

export const getAwsSecrets = async () => {
    try {
        const response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: 'AWSCURRENT'
            })
        );

        const secrets = response.SecretString;
        if (!secrets) throw new Error('Secret string is empty');

        return JSON.parse(secrets);
    } catch (error: any) {
        handleSecretManagerError(error);
    }
}
