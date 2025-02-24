import axios from 'axios';
import { config } from 'dotenv';
import { PurchaseItem, CardDetails } from '../../types/models.types';
import { Product, Purchase, User, Cart, CartITem } from '../models';
import { makePurchase } from '../../mpesa/makePurchase';
import { color } from "console-log-colors";

const paymentURL: string = `http://localhost:${process.env.PORT}/api/v1/process-payment`;

const enrichedPurchaseItems = async (purchaseItems: PurchaseItem[]) => {
    try {
        const productIds = purchaseItems.map((obj) => obj.productId.toString());

        if (productIds.length === 0) throw new Error("Products ids array is empty")

        const products = await Product.find({ _id: { $in: productIds } });

        if (productIds.length === 0) {
            throw new Error("could not get products");
        }

        const productPriceMap = new Map(products.map((product) => [product.id.toString(), product.price]));

        const purchaseItemsWithPrice = purchaseItems.map(item => ({
            ...item,
            price: productPriceMap.get(item.productId.toString()) || 0,
        }));

        return purchaseItemsWithPrice;
    } catch (error: any) {
        throw new Error(`${error.toString()}`);
    }
}

const calculateTotalFromPurchaseItems = async (purchaseItems: PurchaseItem[]) => {
    try {
        const itemsWithPrice = await enrichedPurchaseItems(purchaseItems);

        return itemsWithPrice.map(item => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);

            if (isNaN(price) || isNaN(quantity)) throw new Error('item price or quantity is not a number');

            return price * quantity;
        }).reduce((acc, item) => acc + item, 0)
    } catch (error: any) {
        throw new error(`${error.toString()}`);
    }
}

export const recordPurchase = async (userId: string, purchaseItems: PurchaseItem[]) => {
    try {
        const user = await User.findById(userId);

        if (!user) throw new Error(`Could not find user with id: ${userId}`);

        const total = await calculateTotalFromPurchaseItems(purchaseItems);

        if (isNaN(total)) console.log(`Total is not a number; it is ${typeof total}`);

        const purchase = await Purchase.create({
            items: purchaseItems,
            total_amount: total,
            user: user._id
        });

        if (!purchase) throw new Error('Purchase object not created!');

        return purchase;
    } catch (error: any) {
        throw new Error(`purchase.methods.recordPurchase: ${error.toString()}`);
    }
}

export const markPurchaseAsPaidOrDeclined = async (purchaseId: string, status: 'paid' | 'declined') => {
    try {
        const purchase = await Purchase.findById(purchaseId);

        if (!purchase) throw new Error(`Error finding purchase record with ID: ${purchaseId}`);

        purchase.status = status;

        await purchase.save();
    } catch (error: any) {
        throw new Error(`${error.toString()}`);
    }
}

export const checkoutCart = async (userId: string, cardDetails: CardDetails) => {
    try {
        const userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            throw new Error("Could not find cart");
        }

        const cartItems = await CartITem.find({ _id: { $in: userCart.cartItems } });

        if (cartItems.length === 0) {
            throw new Error("User cart is empty");
        }

        const purchaseItems = [];
        let grand_total = 0;

        for (const item of cartItems) {
            const purchaseItem = {
                productId: item.id,
                quantity: item.quantity
            }

            grand_total += item.total_amount;

            purchaseItems.push(purchaseItem)
        }

        const paymentStatus = await getPaymentResponse(cardDetails, grand_total);

        if (paymentStatus !== 200) {
            throw new Error('Could not make payment!');
        }

        const purchaseRecord = await Purchase.create({
            user: userId,
            items: purchaseItems,
            total_amount: grand_total,
            status: 'paid'
        })

        if (!purchaseRecord) {
            throw new Error("Could not make purchase");
        }

        console.log(color.magenta.bold('Making purchase'));
        const makePurchaseResponse = await makePurchase(userId, purchaseRecord.id);

        await clearUserCart(userId);

        return purchaseRecord;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}

const getPaymentResponse =  async (cardDetails: CardDetails, amount: number) => {
    try {
        const body = {
            ...cardDetails,
            amount
        }

        console.log(`Payment details: ${JSON.stringify(body)}`);
        const response = await axios.post(
            paymentURL,
            {
                ...cardDetails,
                amount: amount * 100 // multiply to convert amount to dollar from cents
            }
        );

        return response.status;
    } catch (error: any) {
        console.log(`Error making payment: ${error.toString()}`);
        return 500;
    }
}

export const clearUserCart = async (userId: string) => {
    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) throw new Error("Could not find user's cart");

        const itemIds = cart.cartItems;

        for (const item of itemIds) {
            const product = await getProductQuantityMapFromCartItem(item.toString());

            await clearProduct(product.id, product.quantity);
        }

        const deletedItems = await CartITem.deleteMany({ _id: { $in: itemIds } });

        if (!deletedItems) throw new Error("Could not clear user's cart");

        cart.cartItems = []
        cart.total_amount = 0;
        cart.total_items = 0;

        await cart.save();

        return deletedItems;
    } catch (error: any) {
        throw new Error(`purchase.methods ${error.toString()}`)
    }
}

const isProductPurchasable = async (productId: string, quantity: number): Promise<boolean> => {
    const product = await Product.findOne({ _id: productId });

    console.log(`Product id: ${productId} Product: ${product?.name}`);

    if (!product) return false;

    if (product.quantity < quantity) return false;

    return true;
}

const clearProduct = async (productId: string, quantity: number) => {
    try {
        const isPurchasable = await isProductPurchasable(productId, quantity);

        if (!isPurchasable) throw new Error("Product cannot be purchased");

        const product = await Product.findById(productId);

        if (!product) throw new Error("Product not found!");

        product.quantity -= quantity;

        await product.save();
    } catch (error: any) {
        throw new Error(error.toString());
    }
}

const getProductQuantityMapFromCartItem = async (itemId: string) => {
    try {
        const cartItem = await CartITem.findOne({ _id: itemId });

        if (!cartItem) throw new Error("Could not find cart item");

        return { id: cartItem.product.toString(), quantity: cartItem.quantity };
    } catch (error: any) {
        throw new Error(error.toString());
    }
}

export const getUserPurchaseHistory = async (userId: string, page: number = 1, limit: number = 10) => {
    try {
        const existingUser = await User.findById(userId);

        if (!existingUser) throw new Error(`Could not find user with id: ${userId}`);

        const skip = (page - 1) * limit;

        const userPurchases = await Purchase.find({ user: userId }).skip(skip).limit(limit);

        const total_items = await Purchase.countDocuments();
        const total_pages = Math.ceil(total_items / limit);

        console.log({ userId, page, limit });

        return {
            metadata: {
                total_items, total_pages,
                current_page: page,
                items_per_page: limit
            },
            userPurchases
        }
    } catch (error: any) {
        throw new Error(`purchase.methods.getUserPurchaseHistory ${error.toString()}`)
    }
}
