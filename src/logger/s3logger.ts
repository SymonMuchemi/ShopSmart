import { PutObjectCommand } from "@aws-sdk/client-s3";
import { initS3Client } from "../s3/client";
import fs from 'fs';
import path from "path";

const logsDir = path.join(__dirname, 'logs')

export const uploadLogsToS3 = async () => {
    const { s3Client, bucketName } = await initS3Client();
    const files = fs.readdirSync(logsDir);

    for (const file of files) {
        const filepath = path.join(logsDir, file);
        const filestream = fs.createReadStream(filepath);

        const params = {
            Bucket: bucketName,
            Key: `logs/${file}`,
            Body: filestream,
            ContentType: 'text/plain'
        }

        try {
            await s3Client.send(new PutObjectCommand(params));
            console.log(`Uploaded ${file} to S3 logs directory.`);
        } catch (error: any) {
            console.error(`Failed to upload log file: ${error.message}`)
        }
    }
}
