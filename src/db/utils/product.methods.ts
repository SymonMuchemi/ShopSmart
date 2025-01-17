import { IProduct } from "../../types";
import { Product } from "../models";
import { generateFileName, getSignedProductImageUrlsArray } from "../../utils";
import { uploadImageToS3 } from "../../s3";

export const createProduct = async (product: IProduct, files: Express.Multer.File[]) => {
    try {
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();

        if (name === undefined) throw new Error("Product name is undefined");
        if (category === undefined) throw new Error("Product category is undefined");

        const existingProduct = await Product.findOne({ name });

        if (existingProduct) throw new Error('Product already exists');

        console.log(`Number of files captured: ${files.length}`);

        const fileNames: string[] = [];

        if (files.length === 0) {
            throw new Error("Files must not be empty");
        }

        for (const file of files) {
            const fileName = generateFileName();

            console.log(`Generated file name: ${fileName}`);

            await uploadImageToS3(file.buffer, fileName, file.mimetype);

            fileNames.push(fileName);
        }

        console.log(`Filenames array: ${fileNames}`);
        console.log(`Uploaded files: ${fileNames.length}`);

        const newProduct = await Product.create({
            ...product,
            imageNames: fileNames,
            name, category
        });

        return newProduct;
    } catch (error: any) {
        throw new Error(`product.methods ${error.toString()}`);
    }
}

export const deleteProductsWithNoImages = async () => {
    try {
        const products = await Product.deleteMany({
            imageNames: []
        });

        console.log(`Product deleted: ${JSON.stringify(products)}`);

        return products;
    } catch (error: any) {
        throw new Error(`product.methods ${error.toString()}`);
    }
}

export const fetchAllProducts = async (page = 1, limit = 10) => {
    try {
        const skip = (page - 1) * limit;

        const products = await Product.find({}).skip(skip).limit(limit);

        if (!products) throw new Error("Could not fetch products");

        const total_items = await Product.countDocuments();
        const total_pages = Math.ceil(total_items / limit);

        const productsWithImageURls = [];

        for (const product of products) {
            const imageURLs = await getSignedProductImageUrlsArray(product);

            productsWithImageURls.push(product, imageURLs);
        }

        return {
            metadata: {
                total_items, total_pages,
                current_page: page,
                items_per_page: limit
            },
            productsWithImageURls
        }
    } catch (error: any) {
        throw new Error(`products.methods ${error.toString()}`);
    }
}
