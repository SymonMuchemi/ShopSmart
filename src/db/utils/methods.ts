import { disconnect } from "process";
import { getObjectSignedUrl } from "../../s3";
import { IProduct } from "../../types";
import { Cart, CartITem, User } from "../models";
import { toASCII } from "punycode";

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
            cartITems: []
        });

        return newCart;

    } catch (error: any) {
        throw new Error(`db.methods: Error creating cart: ${error.toString()}`);
    }
}

export const createCartItem = async (product: IProduct, quantity = 1, userId: string) => {
    try {
        const cart = await Cart.findOne({ user: userId });

        let cartId;
        let total_amount = product.price * quantity

        if (product.discount !== undefined) {
            const discount = total_amount * product.discount;

            total_amount -= discount;
        }

        const image_url = await getObjectSignedUrl(product.imageNames[0]);

        const cartItemParams = {
            product: product.id,
            cart: cartId,
            product_name: product.name,
            product_price: product.price,
            image_url, total_amount
        }

        if (!cart) {
            // create the cart and retrive the cart id
            cartId = (await createCart(userId))._id;

            // create cartItem and add it to the cart
            const newCartItem = CartITem.create(cartItemParams);

            return newCartItem;
        }

        cartId = cart._id;

        // check if there is a cart item with the product
        const existingCartItem = await CartITem.findOne({ product: product.id });

        if (existingCartItem) {
            throw new Error('Cart item already exists!');
        }

        const newCartItem = await CartITem.create(cartItemParams);

        if (!newCartItem) {
            throw new Error('Could not create cart item');
        }

        return newCartItem;
    } catch (error: any) {
        throw new Error(`Error creating cart item: ${error.toString()}`);
    }
} 
