import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    role?: string | 'user' | 'admin';
    phone: number;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    getSignedJwtToken(): Promise<string>;
    matchPassword(password: string): Promise<boolean>;
    getPasswordResetToken(): string;
}

export interface IProduct extends Document {
    id: string;
    name: string;
    slug: string;
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
    productId: string;
    quantity: number;
}

export interface IPurchase {
    id: string;
    items: PurchaseItem[];
    total_amount: number;
    status: 'paid' | 'declined'
}

export interface CardDetails {
    cardNumber: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
    currency?: string;
}

export type AuthUser = Pick<IUser, 'email' | 'password'>
export type UpdateProduct = Partial<IProduct>;
