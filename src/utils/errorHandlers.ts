import { color } from 'console-log-colors';

export const handleSecretManagerError = (error: any) => {
    switch (error.name) {
        case 'DecryptionFailureException':
            console.error(color.redBright('❌ AWS Secrets manager could not decrypt the secret. Check your KMS key.'))
            break;
        case 'InternalServiceErrorException':
            console.error(color.redBright("❌ AWS Secrets Manager encountered an internal error. Try again later."));
            break;

        case 'InvalidParameterException':
            console.error(color.redBright("❌ The request contained an invalid parameter. Check the SecretId."));
            break;

        case 'InvalidRequestException':
            console.error(color.redBright("❌ The request was invalid for the current resource state."));
            console.error(color.yellow("   Possible reasons:"));
            console.error(color.yellow("   - Secret is scheduled for deletion."));
            console.error(color.yellow("   - Secret is managed by another AWS service."));
            break;

        case 'ResourceNotFoundException':
            console.error(color.redBright(`❌ AWS Secrets Manager couldn't find the requested secret'.`));
            console.error(color.yellow("   Ensure the secret exists in AWS Secrets Manager."));
            break;

        default:
            console.error(color.redBright(`❌ An unknown error occurred: ${error.message}`));
            break;
    }
}
