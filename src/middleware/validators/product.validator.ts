import { checkSchema } from "express-validator";
import { IMAGE_VIDEO_URL_REGEX } from "../../utils";

export const createProductSchema = checkSchema({
    name: {
        in: ['body'],
        trim: true,
        isString: {
            errorMessage: 'name must be a string!'
        },
        isLength: {
            options: {
                min: 7,
                max: 50
            },
            errorMessage: 'name must be a string of 7 - 50 characters'
        },
        escape: true
    },
    description: {
        in: ['body'],
        trim: true,
        isString: {
            errorMessage: 'Desscription must be a string!'
        },
        isLength: {
            options: {
                min: 12,
            },
            errorMessage: 'Description must be a string of at least 12 characters'
        },
        optional: true,
        escape: true
    },
    price: {
        in: ['body'],
        trim: true,
        isInt: {
            options: {
                min: 0
            },
            errorMessage: 'price must be a number!'
        },
        escape: true
    },
    quantity: {
        in: ['body'],
        trim: true,
        isInt: {
            options: {
                min: 0
            },
            errorMessage: 'price must be a number!'
        },
        escape: true
    },
    imageUrls: {
        in: ['body'],
        isArray: {
            errorMessage: 'imageUrls must be an array'
        },
        custom: {
            options: (imageUrls: string[]) => {
                const isValid = imageUrls.every((url) =>
                    IMAGE_VIDEO_URL_REGEX.test(url)
                );
                if (!isValid) {
                    throw new Error('Each image URL must be a valid URL');
                }
                return true;
            },
        }
    },
    videoURl: {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'video URL must be a string'
        },
        matches: {
            options: IMAGE_VIDEO_URL_REGEX,
            errorMessage: 'video URL must be valid URL'
        }
    }
})
