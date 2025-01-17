import crypto from 'crypto';
import sharp from 'sharp';

export const generateFileName = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
}

export const resizeImage = async (file: Express.Multer.File) => {
    try {
        const buffer = file.buffer;

        const resizedBuffer = await sharp(buffer)
            .resize({ height: 1920, width: 1080 })
            .toBuffer()

        return resizedBuffer;

    } catch (error: any) {
        throw new Error(`Error resizing image: ${error.toString()}`);
    }
}
