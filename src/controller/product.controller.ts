import { Request, Response, NextFunction } from "express";
import { asyncHandler, generateFileName, ErrorResponse } from "../utils";
import { Product } from "../db/models";
import { uploadImageToS3 } from "../s3";
import { color } from "console-log-colors";
import { deleteImageFromBucket } from "../s3/utils";


const PRODUCT_CREATION_ERROR_MSG = "product.controller: Product already exists";

// @desc    creates a product
// @route   POST /api/v1/products
// @access  Private
export const create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, quantity, category, price } = req.body;

    const existingProduct = await Product.findOne({ name: name.toLowerCase() });

    if (existingProduct) {
        return next(new ErrorResponse(PRODUCT_CREATION_ERROR_MSG, 409))
    }

    if (!req.files) {
        return next(new ErrorResponse('Please attach image files', 400));
    }

    const files: Express.Multer.File[] = req.files as Express.Multer.File[] || [];
    const fileNames: string[] = [];

    // TODO: CHECK IF THIS IS NECESSARY
    if (files.length === 0) {
        console.log(color.red.bold('Files array is empty!'));
        return next(new ErrorResponse('Files must not be empty!', 400));
    }

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    console.log(`Total size of files: ${totalSize} bytes`);

    if (totalSize >= 5 * 1024 * 1024) return next(new ErrorResponse('Req files are too large!!', 400));

    for (const file of files) {
        const filename = 'photo_' + generateFileName();

        await uploadImageToS3(file.buffer, filename, file.mimetype)

        fileNames.push(filename)
    }

    const newProduct = await Product.create({
        name, description, imageNames: fileNames,
        category, quantity, price
    });

    // const newProduct = { ...req.body }

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct
    })
});


// @desc    fetches all products
// @route   PUT /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!res.locals.advancedResults) {
        return next(new ErrorResponse('Error fetching products!!', 500));
    }

    res.status(200).json(res.locals.advancedResults);
});

// TODO: Handle image addition and deletions

// @desc    updates a product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let product = await Product.findById(req.params.id);

    if (!product) return next(new ErrorResponse(`Could not find product with id: ${req.params.id}`, 400));

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: product
    })
});

// @desc    adds photos to a product
// @route   PUT /api/v1/products/:id/photos
// @access  Private
export const addProductPhoto = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let product = await Product.findById(req.params.id);

    if (!product) return next(new ErrorResponse(`Could not find product with id: ${req.params.id}`, 400));

    if (!req.files) return next(new ErrorResponse('Please attach image files', 400));

    const files: Express.Multer.File[] = req.files as Express.Multer.File[] || [];

    const fileNames: string[] = [];

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    console.log(`Total size of files: ${totalSize} bytes`);

    if (totalSize >= 5 * 1024 * 1024) return next(new ErrorResponse('Req files are too large!!', 400));

    for (const file of files) {
        const filename = 'photo_' + generateFileName();

        await uploadImageToS3(file.buffer, filename, file.mimetype)

        fileNames.push(filename)
    }

    product.imageNames = [...product.imageNames, ...fileNames] as [string];

    product = await product.save();

    res.status(200).json({
        success: true,
        data: product
    })
})

// @desc    deletes a product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) return next(new ErrorResponse(`Could not find product with id: ${req.params.id}`, 400));

    console.log(`Deleting: ${product.name}`);
    if (product.imageNames.length > 0) {
        for (const image of product.imageNames) {
            console.log(color.blue.bold(`Deleting: ${image}`));
            await deleteImageFromBucket(image);
        }
    }

    const deletionStatus = await product.deleteOne();

    res.status(200).json({
        success: true,
        data: deletionStatus
    })
})

// @desc    deletes a product's phot
// @route   DELETE /api/v1/products/:id/photos/:photo_name
// @access  Private
export const deleteProductPhoto = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let product = await Product.findById(req.params.id);

    if (!product) return next(new ErrorResponse(`Could not find product with id: ${req.params.id}`, 400));

    // check photo in product.imageName
    if (!product.imageNames.includes(req.params.photo_name)) return next("Photo not found!");

    await deleteImageFromBucket(req.params.photo_name);

    product.imageNames = product.imageNames.filter(photo => photo !== req.params.photo_name) as [string];

    product = await product.save();

    res.status(200).json({
        success: true,
        data: product
    })

})
