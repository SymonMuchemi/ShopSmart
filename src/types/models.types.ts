import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    role: string | 'user' | 'admin';
}

export interface IProduct extends Document {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    imageNames: [string];
    videoUrl?: string;
    category: string;
    imageUrls?: string[];
}

export interface ICartItem extends Document {
    product: string;
    cart: string;
    product_name: string;
    image_url: string;
    quantity: number;
    product_price: number;
    total_amount: number;
}

export interface ICart extends Document {
    id?: string;
    user: string;
    cartItems: mongoose.Types.ObjectId[];
    total_items: number;
    total_amount: number;
}

export interface PurchaseItem {
    productId: mongoose.Types.ObjectId;
    quantity: Number;
}

export interface IPurchase {
    id: string;
    items: PurchaseItem[];
    status: 'paid' | 'declined'
}

export type AuthUser = Pick<IUser, 'email' | 'password'>
export type UpdateProduct = Partial<IProduct>;
