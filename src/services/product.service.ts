import Product from "../db/models/Product";
import { IProduct, ReturnResponse } from "../types";

export const createProduct = async (product: IProduct): Promise<ReturnResponse> => {
    try {

        const existingProduct = await Product.findOne({ name: product.name.toLowerCase() });

        if (existingProduct) {
            return {
                code: 409,
                message: 'Database conflict',
                details: 'product already exists'
            }
        }

        const newProduct = await Product.create({
            ...product,
            name: product.name.toLowerCase(),
            category: product.category.toLowerCase(),
            videoUrl: product.videoUrl
        });

        return {
            code: 201,
            message: 'Product created successfully',
            details: {
                newProduct
            }
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'product.service: error creating new product',
            details: error.toString()
        }
    }
}
