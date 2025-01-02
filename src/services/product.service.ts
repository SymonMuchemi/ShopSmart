import { Product } from "../db/models";
import { uploadImageToS3 } from "../s3";
import { genereteFileName, resizeImage, getSignedUrlsArray } from "../utils";
import { IProduct, ReturnResponse, UpdateProduct } from "../types";

export const createProduct = async (
    product: IProduct,
    files: Express.Multer.File[]
): Promise<ReturnResponse> => {
    try {
        const existingProduct = await Product.findOne({
            name: product.name.toLowerCase(),
        });

        if (existingProduct) {
            return {
                code: 409,
                message: "Database conflict",
                details: "product already exists",
            };
        }

        console.log("Files in req:", files.length);

        const names = [];

        if (files.length == 0) {
            return {
                code: 400,
                message: "Error creating product",
                details: "No product image file attached!",
            };
        }
        for (const file of files) {
            const fileName = genereteFileName();

            const resizedImageBuffer: Buffer = await resizeImage(file);

            await uploadImageToS3(resizedImageBuffer, fileName, file.mimetype);

            names.push(fileName);
        }
        console.log("Uploaded image:", names.length);

        const newProduct = await Product.create({
            ...product,
            imageNames: names,
            name: product.name.toLowerCase(),
            category: product.category.toLowerCase(),
            videoUrl: product.videoUrl,
        });

        return {
            code: 201,
            message: "Product created successfully",
            details: {
                newProduct,
            },
        };
    } catch (error: any) {
        return {
            code: 500,
            message: "product.service: error creating new product",
            details: error.toString(),
        };
    }
};

export const fechAllProducts = async (page = 1, limit = 10): Promise<ReturnResponse> => {
    try {
        const skip = (page - 1) * limit;

        const products = await Product.find({}).skip(skip).limit(limit);

        if (!products) {
            return {
                code: 400,
                message: "Error fetching products",
                details: "No products found!",
            };
        }

        const totalItems = await Product.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        const productsWithImageURls = [];

        for (let product of products) {
            const imageNames = product.imageNames;
            const imageUrls = await getSignedUrlsArray(imageNames);

            productsWithImageURls.push({ product, imageURls: imageUrls });
        }

        return {
            code: 200,
            message: `${products.length} found!`,
            details: productsWithImageURls,
        };
    } catch (error: any) {
        return {
            code: 500,
            message: "product.service: error fetching products",
            details: error.toString(),
        };
    }
};

export const fetchProductByName = async (
    name: string
): Promise<ReturnResponse> => {
    try {
        const product = await Product.findOne({ name: name.toLowerCase() });

        if (!product) {
            return {
                code: 400,
                message: "Error fetching product",
                details: `Cannot find product: ${name}`,
            };
        }

        const imageNames = product.imageNames;
        const imageUrls = await getSignedUrlsArray(imageNames);

        return {
            code: 200,
            message: "Product found!",
            details: { product, imageUrls: imageUrls },
        };
    } catch (error: any) {
        return {
            code: 500,
            message: "product.service: error fetching products",
            details: error.toString(),
        };
    }
};

export const fetchProductByCategory = async (
    category: string
): Promise<ReturnResponse> => {
    try {
        const products = await Product.find({ category: category.toLowerCase() });

        if (!products) {
            return {
                code: 400,
                message: "Error fetching product",
                details: `Cannot find products ${category}`,
            };
        }

        const productsWithImageURls = [];

        for (let product of products) {
            const imageNames = product.imageNames;
            const imageUrls = await getSignedUrlsArray(imageNames);

            productsWithImageURls.push({ product, imageURls: imageUrls });
        }

        return {
            code: 200,
            message: "Product found!",
            details: productsWithImageURls,
        };
    } catch (error: any) {
        return {
            code: 500,
            message: "Internal server error",
            details: error.toString(),
        };
    }
};

export const fetchProductById = async (id: string): Promise<ReturnResponse> => {
    try {
        const product = await Product.findOne({ _id: id });

        if (!product) {
            return {
                code: 400,
                message: "Error fetching product",
                details: `Cannot find product with id: ${id}`,
            };
        }

        return {
            code: 200,
            message: "Product found!",
            details: product,
        };
    } catch (error: any) {
        return {
            code: 500,
            message: "Internal server error",
            details: error.toString(),
        };
    }
};
export const updateProductByName = async (
    name: string,
    updateData: UpdateProduct
): Promise<ReturnResponse> => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { name: name.toLowerCase() },
            {
                $set: {
                    ...updateData,
                    name: name.toLowerCase(),
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return {
                code: 400,
                message: "Error updating product",
                details: `Could not find product with name ${name}`,
            };
        }

        return {
            code: 200,
            message: "Product updated successfully",
            details: updatedProduct,
        };
    } catch (error: any) {
        return {
            code: 500,
            message: "product.service: error updating product",
            details: error.toString(),
        };
    }
};

export const updateProductById = async (
    id: string,
    updateData: UpdateProduct
): Promise<ReturnResponse> => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    ...updateData,
                    name: updateData.name?.toLowerCase(),
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return {
                code: 400,
                message: "Error updating product",
                details: `Could not find product with id ${id}`,
            };
        }

        return {
            code: 200,
            message: "Product updated successfully",
            details: updatedProduct,
        };
    } catch (error: any) {
        return {
            code: 500,
            message: "product.service: error updating product",
            details: error.toString(),
        };
    }
};

export const deleteProduct = async (id: string): Promise<ReturnResponse> => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: id });

        if (!deletedProduct) {
            return {
                code: 400,
                message: "Error deleting product",
                details: `Could not find product with id ${id}`,
            };
        }

        return {
            code: 200,
            message: "Product deleted successfully",
            details: deletedProduct,
        };
    } catch (error: any) {
        return {
            code: 500,
            message: "product.service: error deleting product",
            details: error.toString(),
        };
    }
};
