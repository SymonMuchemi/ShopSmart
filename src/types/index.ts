import { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    role: string | 'user' | 'admin';
}

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    quantity: number;
}

export interface ReturnResponse {
    code: number;
    message: string;
    details: any;
}

export type AuthUser = Pick<IUser, 'email' | 'password'>
