import { Request, Response, NextFunction } from "express";
import { asyncHandler, generateFileName, ErrorResponse } from "../utils";
import { Product } from "../db/models";
import { uploadImageToS3 } from "../s3";
import { deleteImageFromBucket } from "../s3/utils";
import logger from "../logger/logging";

const PRODUCT_CREATION_ERROR_MSG = "product.controller: Product already exists";

// @desc    creates a product
// @route   POST /api/v1/products
// @access  Private
export const createProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, quantity, category, price } = req.body;

    logger.info(`Creating product: ${name}`);

    const existingProduct = await Product.findOne({ name: name.toLowerCase() });

    if (existingProduct) {
        logger.error(PRODUCT_CREATION_ERROR_MSG);
        return next(new ErrorResponse(PRODUCT_CREATION_ERROR_MSG, 409));
    }

    if (!req.files) {
        logger.error('Please attach image files');
        return next(new ErrorResponse('Please attach image files', 400));
    }

    const files: Express.Multer.File[] = req.files as Express.Multer.File[] || [];
    const fileNames: string[] = [];

    if (files.length === 0) {
        logger.error('Files array is empty!');
        return next(new ErrorResponse('Files must not be empty!', 400));
    }

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    logger.info(`Total size of files: ${totalSize} bytes`);

    if (totalSize >= 5 * 1024 * 1024) {
        logger.error('Req files are too large!!');
        return next(new ErrorResponse('Req files are too large!!', 400));
    }

    for (const file of files) {
        const filename = 'photo_' + generateFileName();
        await uploadImageToS3(file.buffer, filename, file.mimetype);
        fileNames.push(filename);
    }

    const newProduct = await Product.create({
        name, description, imageNames: fileNames,
        category, quantity, price
    });

    logger.info(`Product created successfully: ${newProduct.name}`);

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct
    });
});

// @desc    fetches all products
// @route   PUT /api/v1/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Fetching all products');

    if (!res.locals.advancedResults) {
        logger.error('Error fetching products!!');
        return next(new ErrorResponse('Error fetching products!!', 500));
    }

    res.status(200).json(res.locals.advancedResults);
});

// @desc    updates a product
// @route   PUT /api/v1/products/:id
// @access  Private
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Updating product with id: ${req.params.id}`);

    let product = await Product.findById(req.params.id);

    if (!product) {
        logger.error(`Could not find product with id: ${req.params.id}`);
        return next(new ErrorResponse(`Could not find product with id: ${req.params.id}`, 400));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        logger.error('Error creating product');
        return next(new ErrorResponse('Could not create product', 500));
    }

    logger.info(`Product updated successfully: ${product.name}`);

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    adds photos to a product
// @route   PUT /api/v1/products/:id/photos
// @access  Private
export const addProductPhoto = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Adding photos to product with id: ${req.params.id}`);

    let product = await Product.findById(req.params.id);

    if (!product) {
        logger.error(`Could not find product with id: ${req.params.id}`);
        return next(new ErrorResponse(`Could not find product with id: ${req.params.id}`, 400));
    }

    if (!req.files) {
        logger.error('Please attach image files');
        return next(new ErrorResponse('Please attach image files', 400));
    }

    const files: Express.Multer.File[] = req.files as Express.Multer.File[] || [];
    const fileNames: string[] = [];

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    logger.info(`Total size of files: ${totalSize} bytes`);

    if (totalSize >= 5 * 1024 * 1024) {
        logger.error('Req files are too large!!');
        return next(new ErrorResponse('Req files are too large!!', 400));
    }

    for (const file of files) {
        const filename = 'photo_' + generateFileName();
        await uploadImageToS3(file.buffer, filename, file.mimetype);
        fileNames.push(filename);
    }

    product.imageNames = [...product.imageNames, ...fileNames] as [string];
    product = await product.save();

    logger.info(`Photos added successfully to product: ${product.name}`);

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    deletes a product
// @route   DELETE /api/v1/products/:id
// @access  Private
export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Deleting product with id: ${req.params.id}`);

    const product = await Product.findById(req.params.id);

    if (!product) {
        logger.error(`Could not find product with id: ${req.params.id}`);
        return next(new ErrorResponse(`Could not find product with id: ${req.params.id}`, 400));
    }

    logger.info(`Deleting: ${product.name}`);
    if (product.imageNames.length > 0) {
        for (const image of product.imageNames) {
            logger.info(`Deleting image: ${image}`);
            await deleteImageFromBucket(image);
        }
    }

    const deletionStatus = await product.deleteOne();

    logger.info(`Product deleted successfully: ${product.name}`);

    res.status(200).json({
        success: true,
        data: deletionStatus
    });
});

// @desc    deletes a product's photo
// @route   DELETE /api/v1/products/:id/photos/:photo_name
// @access  Private
export const deleteProductPhoto = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Deleting photo from product with id: ${req.params.id}`);

    let product = await Product.findById(req.params.id);

    if (!product) {
        logger.error(`Could not find product with id: ${req.params.id}`);
        return next(new ErrorResponse(`Could not find product with id: ${req.params.id}`, 400));
    }

    if (!product.imageNames.includes(req.params.photo_name)) {
        logger.error('Photo not found!');
        return next(new ErrorResponse('Photo not found!', 400));
    }

    await deleteImageFromBucket(req.params.photo_name);

    product.imageNames = product.imageNames.filter(photo => photo !== req.params.photo_name) as [string];
    product = await product.save();

    logger.info(`Photo deleted successfully from product: ${product.name}`);

    res.status(200).json({
        success: true,
        data: product
    });
});
