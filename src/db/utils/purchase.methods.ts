import { PurchaseItem } from '../../types/models.types';
import { Product, Purchase, User, Cart, CartITem } from '../models';

const enrichedPurchaseItems = async (purchaseItems: PurchaseItem[]) => {
    try {
        const productIds = purchaseItems.map((obj) => obj.productId.toString());

        if (productIds.length === 0) console.log("Products ids array is empty")

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

export const checkoutCart = async (userId: string) => {
    try {
        const userCart = await Cart.findOne({ user: userId });

        if (!userCart) {
            console.log(`Could not find cart with user id: ${userId}`);

            throw new Error("Could not find cart");
        }

        console.log(`User cart: ${JSON.stringify(userCart)}`);

        const cartItems = await CartITem.find({ _id: { $in: userCart.cartItems } });

        if (cartItems.length === 0) {
            console.log("User cart is empty");

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

        console.log(purchaseItems);

        const purchaseRecord = await Purchase.create({
            user: userId,
            items: purchaseItems,
            total_amount: grand_total
        })

        if (!purchaseRecord) {
            throw new Error("Could not make purchase");
        }

        await clearUserCart(userId);

        return purchaseRecord;
    } catch (error: any) {
        throw new Error(error.toString());
    }
}

export const clearUserCart = async (userId: string) => {
    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) throw new Error("Could not find user's cart");

        const productIds = cart.cartItems;

        const deletedItems = await CartITem.deleteMany({ _id: { $in: productIds } });

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
    const product = await Product.findOne({ id: productId });

    if (!product) return false;

    if (product.quantity < quantity) return false;

    return true;
}
