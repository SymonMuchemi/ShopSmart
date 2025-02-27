import { Request, Response, NextFunction } from "express";
import { asyncHandler, generateFileName } from "../utils";
import { Product } from "../db/models";
import { uploadImageToS3 } from "../s3";


const PRODUCT_CREATION_ERROR_MSG = "product.controller: Product already exists";
const PRODUCT_FETCH_ERROR_MSG = "product.controller: Error fetching products";
const PRODUCT_UPDATE_ERROR_MSG = "product.controller: Error updating product";
const PRODUCT_DELETION_ERROR_MSG = "product.controller: Error deleting product";

export const create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, quantity, category, } = req.body;

    const existingProduct = await Product.findOne({ name: name.toLowerCase() });

    if (existingProduct) {
        return next(new ErrorResponse(PRODUCT_CREATION_ERROR_MSG, 409))
    }

    if (!req.files) {
        return next(new ErrorResponse('Please attach image files', 400));
    }

    let files: Express.Multer.File[] = [];
    const fileNames: string[] = [];

    if (Array.isArray(req.files)) {
        files = req.files;
    } else {
        for (const key in req.files) {
            if (req.files.hasOwnProperty(key)) {
                files = files.concat(req.files[key]);
            }
        }
    }

    for (const file of files) {
        const filename = 'photo_' + generateFileName();

        await uploadImageToS3(file.buffer, filename, file.mimetype)

        fileNames.push(filename)
    }

    const newProduct = await Product.create({
        name, description, imageNames: fileNames,
        category
    });

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct
    })
})
