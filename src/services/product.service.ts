import Product from "../db/models/Product";
import { IProduct, ReturnResponse, UpdateProduct } from "../types";

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

export const fechAllProducts = async (): Promise<ReturnResponse> => {
    try {
        const products = await Product.find({});

        if (!products) {
            return {
                code: 400,
                message: 'Error fetching products',
                details: 'No products found!'
            }
        }

        return {
            code: 200,
            message: `${products.length} found!`,
            details: products
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Internal server error',
            details: error.toString()
        }
    }
}

export const fetchProductByName = async (name: string): Promise<ReturnResponse> => {
    try {
        const product = await Product.findOne({ name: name.toLowerCase() });

        if (!product) {
            return {
                code: 400,
                message: 'Error fetching product',
                details: `Cannot find product: ${name}`
            }
        }

        return {
            code: 200,
            message: 'Product found!',
            details: product
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Internal server error',
            details: error.toString()
        }
    }
}

export const fetchProductByCategory = async (category: string): Promise<ReturnResponse> => {
    try {
        const product = await Product.find({ category: category.toLowerCase() });

        if (!product) {
            return {
                code: 400,
                message: 'Error fetching product',
                details: `Cannot find product: ${name}`
            }
        }

        return {
            code: 200,
            message: 'Product found!',
            details: product
        }
    } catch (error: any) {
        return {
            code: 500,
            message: 'Internal server error',
            details: error.toString()
        }
    }
}

export const updateProductByName = async (name: string, updateData: UpdateProduct): Promise<ReturnResponse> => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { name: name.toLowerCase() },
            {
                $set: {
                    ...updateData,
                    name: name.toLowerCase()
                }
            },
            { new: true, runValidators: true }
        )

        if (!updatedProduct) {
            return {
                code: 400,
                message: 'Error updating product',
                details: `Could not find product with name ${name}`
            }
        }

        return {
            code: 200,
            message: 'Product updated successfully',
            details: updatedProduct
        }

    } catch (error: any) {
        return {
            code: 500,
            message: 'Internal server error',
            details: error.toString()
        }
    }
}

export const updateProductById = async (id: string, updateData: UpdateProduct): Promise<ReturnResponse> => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    ...updateData,
                    name: updateData.name?.toLowerCase()
                }
            },
            { new: true, runValidators: true }
        )

        if (!updatedProduct) {
            return {
                code: 400,
                message: 'Error updating product',
                details: `Could not find product with id ${id}`
            }
        }

        return {
            code: 200,
            message: 'Product updated successfully',
            details: updatedProduct
        }

    } catch (error: any) {
        return {
            code: 500,
            message: 'Internal server error',
            details: error.toString()
        }
    }
}
