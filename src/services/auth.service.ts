import User from "../db/models/User";
import bcrypt from 'bcryptjs';
import { IUser } from "../types";

export const createUser = async (user: IUser) => {
    try {
        const { username, password, email, role } = user;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return {
                code: 409,
                messsage: 'Database conflict',
                details: 'user already exists'
            }
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = await User.create({
            username, email,
            password: hashedPassword,
            role: role || 'user'
        });

        return {
            code: 201,
            message: 'User created successfully',
            details: {
                ...newUser
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
