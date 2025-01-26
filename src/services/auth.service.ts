import User from "../db/models/User";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { IUser, AuthUser } from "../types";

const INVALID_CREDENTIALS_ERROR = {
    code: 400,
    message: 'login error',
    details: 'Invalid email/password'
}

export const createUser = async (user: IUser) => {
    try {
        const { username, password, email, role, phone } = user;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return {
                code: 409,
                message: 'Database conflict',
                details: 'user already exists'
            }
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = await User.create({
            username, email,
            password: hashedPassword,
            role: role || 'user',
            phone
        });

        return {
            code: 201,
            message: 'User created successfully',
            details: {
                newUser
            }
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'auth.service: error creating new user',
            details: error.toString()
        }
    }
}

export const authenticateUser = async (user: AuthUser) => {
    try {
        const { email, password } = user;

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return INVALID_CREDENTIALS_ERROR
        }

        const isMatch: boolean = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            return INVALID_CREDENTIALS_ERROR;
        }

        const jwtSecret: string | undefined = process.env.JWT_SECRET;
        const jwtExpiration: string | undefined = process.env.JWT_EXPIRATION;

        if (!jwtExpiration || !jwtSecret) {
            console.log('Missing jwt secret or expiration!');

            return {
                code: 500,
                message: 'auth.service: Missing data',
                details: 'The jwt secret or expiration is/are undefined'
            }
        }

        const token = jwt.sign({ userId: existingUser._id }, jwtSecret, { expiresIn: jwtExpiration });

        return {
            code: 200,
            message: 'Authentication successful',
            details: { token }
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'auth.services: could not authenticate user',
            details: error.toString()
        }
    }
}
