import { checkSchema } from "express-validator";

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
            errorMessage: 'name must be a string of 7 - 24 characters'
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
    }
})
