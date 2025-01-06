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
            cartITems: []
        });

        return newCart;

    } catch (error: any) {
        throw new Error(`db.methods: Error creating cart: ${error.toString()}`);
    }
}

export const createCartItem = async (userId: string, product: IProduct, quantity = 1) => {
    try {
        const cart = await Cart.findOne({ user: userId });

        let cartId;
        let total_amount = product.price * quantity;

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

        // add the cartItemId to the cart
        const updatedCart = await Cart.findByIdAndUpdate(cart.id, {
            cartITems: [...cart.cartITems, newCartItem.id]
        });

        console.log(`Updated cart: ${updatedCart}`);

        return newCartItem;
    } catch (error: any) {
        throw new Error(`Error creating cart item: ${error.toString()}`);
    }
}

export const updateCartItemQuantity = async (cartItemId: string, quantity: number) => {
    try {
        if (quantity < 1) {
            throw new Error('CartItem cannot be less that 1');
        }

        const cartItem = await CartITem.findById(cartItemId);

        if (!cartItem) {
            throw new Error(`Could not get item with id: ${cartItem}`)
        }

        const updatedCartItem = await CartITem.findByIdAndUpdate(cartItemId, {
            quantity,
            total_amount: cartItem.price * quantity
        })

        if (!updatedCartItem) {
            throw new Error("Error updating cart item");
        }

        return updatedCartItem;
    } catch (error: any) {
        throw new Error(`Error updating cart item: ${error.toString}`);
    }
}

export const deleteCartItem = async (cartItemId: string) => {
    try {
        const cartItem = await CartITem.findByIdAndUpdate(cartItemId);

        if (!cartItem) {
            throw new Error("Error deleting cart Item")
        }
    } catch (error) {

    }
}
