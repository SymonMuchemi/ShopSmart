import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, bucketName } from "./client";
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand, BucketAccelerateStatus } from "@aws-sdk/client-s3";

export const uploadImageToS3 = async (fileBuffer: Buffer, fileName: string, mimeType: string): Promise<void> => {
    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: fileName,
        ContentType: mimeType
    }

    await s3Client.send(new PutObjectCommand(uploadParams));
}

export const getObjectSignedUrl = async (key: string) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: key,
            ResponseContentDisposition: "inline"
        }

        const command = new GetObjectCommand(params);
        const seconds = 60 * 60;

        return await getSignedUrl(s3Client, command, { expiresIn: seconds });
    } catch (error: any) {
        throw new Error(`Error getting signed URL: ${error.toString()}`)
    }
}

export const deleteImageFromBucket = async (imageName: string) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: imageName
        }

        await s3Client.send(new DeleteObjectCommand(params));
    } catch (error: any) {
        throw new Error(`Error deleting image: ${error.toString()}`)
    }
}
