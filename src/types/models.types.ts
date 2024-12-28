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
    imageNames: [string];
    discount?: number;
    videoUrl?: string;
    category: string;
}

export interface ICartItem extends Document {
    product: string;
    name: string;
    quantity: number;
    price: number;
    total_amount: number;
}

export interface ICart extends Document {
    user: string;
    cartITems: [string];
    total_items: number;
    total_amount: number;
}

export type AuthUser = Pick<IUser, 'email' | 'password'>
export type UpdateProduct = Partial<IProduct>;
