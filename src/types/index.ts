import { Document } from "mongoose";
import { Request } from "express";

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
    imageUrls: [string];
    videoUrl?: string;
    category: string;
}

export interface ReturnResponse {
    code: number;
    message: string;
    details: any;
}

export interface CustomRequest extends Request {
    user?: any;
}

declare module 'express' {
    export interface Request {
        user?: {
            id: string;
            role: string;
        }
    }
}

export type AuthUser = Pick<IUser, 'email' | 'password'>
export type UpdateProduct = Partial<IProduct>;
