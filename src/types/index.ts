import { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    role: string | 'user' | 'admin';
}

export type AuthUser = Pick<IUser, 'email' | 'password'>
