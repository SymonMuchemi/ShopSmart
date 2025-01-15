import mongoose from 'mongoose';
import { PurchaseItem } from '../../types/models.types';
import { Product, Purchase } from '../models';

const enrichedPurchaseItems = async (purchaseItems: PurchaseItem[]) => {
    try {
        const productIds = purchaseItems.map((obj) => obj.productId);

        const products = await Product.find({ _id: { $in: productIds } });

        if (productIds.length === 0) {
            throw new Error("purchase.methods: could not get products");
        }

        const productPriceMap = new Map(products.map((product) => [product.id.toString(), product.price]));

        const purchaseItemsWithPrice = purchaseItems.map(item => ({
            ...item,
            price: productPriceMap.get(item.productId.toString()) || 0,
        }));

        return purchaseItemsWithPrice;
    } catch (error: any) {
        throw new Error(`Purchase.methods: ${error.toString()}`);
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
        throw new error(`purchase.methods: ${error.toString()}`);
    }
}

export const recordPurchase = async (purchaseItems: PurchaseItem[]) => {
    try {
        const total = await calculateTotalFromPurchaseItems(purchaseItems);

        const purchase = await Purchase.create({
            items: purchaseItems,
            total_amount: total
        });

        return purchase;
    } catch (error: any) {
        throw new Error(`purchase.methods: ${error.toString()}`);
    }
}

export const markPurchaseAsPaidOrDeclined = async (purchaseId: mongoose.Types.ObjectId, status: 'paid' | 'declined') => {
    try {
        const purchase = await Purchase.findById(purchaseId);

        if (!purchase) throw new Error(`Error finding purchase record with ID: ${purchaseId}`);

        purchase.status = status;

        await purchase.save();
    } catch (error: any) {
        throw new Error(`purchase.methods: ${error.toString()}`);
    }
}
