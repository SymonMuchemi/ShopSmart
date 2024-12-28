import { s3Client, bucketName } from "./client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const uploadImageToS3 = async (fileBuffer: Buffer, fileName: string, mimeType: string): Promise<void> => {
    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: fileName,
        Type: mimeType
    }

    await s3Client.send(new PutObjectCommand(uploadParams));
}
