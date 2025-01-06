import { getObjectSignedUrl } from "../../s3";
import { IProduct } from "../../types";
import { Cart, CartITem, User } from "../models";

export const createCart = async (userId: string) => {
    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            throw new Error(`Error finding user with id: ${userId}`);
        }

        const existingCart = await Cart.findOne({ userId });

        if (existingCart) {
            throw new Error(`Cart with user id: ${userId} already exists!`)
        }

        const newCart = await Cart.create({
            user: user._id,
            cartItems: []
        });

        return newCart;

    } catch (error: any) {
        throw new Error(`db.methods: Error creating cart: ${error.toString()}`);
    }
}

export const createCartItem = async (userId: string, product: IProduct, quantity = 1) => {
    try {
        const cart = await findOrCreateCart(userId);

        const existingCartItem = await CartITem.findOne({
            product: product._id,
            cart: cart._id
        });

        if (existingCartItem) throw new Error("Cart item already exists!");

        const total_amount = product.price * quantity;
        const image_url = await getObjectSignedUrl(product.imageNames[0]);

        const newCartItem = await CartITem.create({
            product: product._id,
            cart: cart._id,
            product_name: product.name,
            product_price: product.price,
            image_url, total_amount
        });

        if (!newCartItem) throw new Error('Failed to create new cart item');

        cart.cartItems.push(newCartItem._id as string);
        await cart.save();


        return newCartItem;

    } catch (error: any) {
        throw new Error(`Error in createCartItem: ${error.toString()}`);
    }
}

export const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
    try {
        if (quantity < 1) {
            throw new Error('CartItem cannot be less that 1');
        }

        const cartItem = await CartITem.findById(cartItemId);

        if (!cartItem) {
            throw new Error(`Could not get item with id: ${cartItemId}`)
        }


        const total_amount = cartItem.product_price * quantity;

        const updatedCartItem = await CartITem.findByIdAndUpdate(cartItemId, {
            quantity,
            total_amount
        })

        if (!updatedCartItem) {
            throw new Error("Error updating cart item");
        }

        return updatedCartItem;
    } catch (error: any) {
        throw new Error(`Error in updateCartQuantity: ${error.toString()}`);
    }
}

export const deleteCartItem = async (cartItemId: string) => {
    try {
        const cartItem = await CartITem.findById(cartItemId);

        if (!cartItem) throw new Error("Error deleting cart Item");

        const cart = await Cart.findById(cartItem?.cart);

        if (!cart) throw new Error('Could not find the cart busket!');

        cart.cartItems = cart.cartItems.filter((item) => item !== cartItemId)

        await cart.save();

        const deletedItem = await CartITem.deleteOne({_id: cartItemId});

        return deletedItem;
    } catch (error: any) {
        throw new Error(`Error at deleteCartItem: ${error.toString()}`);
    }
}

const findOrCreateCart = async (userId: string) => {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({
            user: userId,
            cartItems: [],
            total_items: 0,
            total_amount: 0
        });
    }

    return cart;
}
