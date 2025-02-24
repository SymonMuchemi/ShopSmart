import { S3Client } from '@aws-sdk/client-s3';
import { getAwsSecrets } from '../config/secrets';

export const initS3Client = async () => {
    const secrets = await getAwsSecrets();

    const bucketName = secrets.S3_BUCKET_NAME;
    const region = secrets.S3_BUCKET_REGION;
    const accessKeyId = secrets.S3_ACCESS_KEY;
    const secretAccessKey = secrets.S3_SECRET_ACCESS_KEY;

    if (!bucketName) throw new Error("❌ Missing credential: S3_BUCKET_NAME");
    if (!region) throw new Error("❌ Missing credential: S3_BUCKET_REGION");
    if (!accessKeyId) throw new Error("❌ Missing credential: S3_ACCESS_KEY");
    if (!secretAccessKey) throw new Error("❌ Missing credential: S3_SECRET_ACCESS_KEY");

    return {
        s3Client: new S3Client({
            region,
            credentials: {
                accessKeyId, secretAccessKey
            }
        }), bucketName
    }
}
