import { checkSchema } from "express-validator";

export const createUserSchema = checkSchema({
    username: {
        in: ['body'],
        trim: true,
        isString: {
            errorMessage: 'Username must be a string!'
        },
        isLength: {
            options: {
                min: 3,
                max: 24
            },
            errorMessage: 'username must be a string of 3 - 24 characters'
        },
        escape: true
    },
    password: {
        in: ['body'],
        trim: true,
        isString: {
            errorMessage: 'password must be a string of mixed characters'
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'password must be atleast 8 characters long'
        },
        escape: true
    },
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'email must be a valid email address'
        },
        normalizeEmail: true
    },
    role: {
        in: ['body'],
        isIn: {
            options: [['user', 'admin']],
            errorMessage: 'role must be either "user" or "admin"'
        },
        optional: true
    }
});

export const validateUserSchema = checkSchema({
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'email must be a valid email address'
        },
        normalizeEmail: true,
        escape: true
    }, 
    password: {
        in: ['body'],
        trim: true,
        isString: {
            errorMessage: 'password must be a string of mixed characters'
        },
        escape: true
    }
});
