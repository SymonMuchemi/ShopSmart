import { Request, Response } from "express";
import { handleRequest } from "../utils";
import {
    createProduct,
    fechAllProducts,
    fetchProductByName,
    fetchProductByCategory,
    updateProductByName,
    deleteProduct
} from "../services/product.service";

const PRODUCT_CREATION_ERROR_MSG = "product.controller: Error creating product";
const PRODUCT_FETCH_ERROR_MSG = "product.controller: Error fetching products";
const PRODUCT_UPDATE_ERROR_MSG = "product.controller: Error updating product";
const PRODUCT_DELETION_ERROR_MSG = "product.controller: Error deleting product";

export const create = async (req: Request, res: Response) => {
    await handleRequest(req, res, createProduct, PRODUCT_CREATION_ERROR_MSG);
}
export const findAll = async (req: Request, res: Response) => {
    let productName = req.query.name as string;
    let category = req.query.category as string;


    if (productName) {
        productName = productName.toLowerCase();

        await handleRequest(req, res, () => fetchProductByName(productName), PRODUCT_FETCH_ERROR_MSG)
    } else if (category) {
        category = category.toLowerCase();

        await handleRequest(req, res, () => fetchProductByCategory(category), PRODUCT_FETCH_ERROR_MSG)
    } else {
        await handleRequest(req, res, fechAllProducts, PRODUCT_CREATION_ERROR_MSG);
    }
}

export const updateByName = async (req: Request, res: Response) => {
    let name = req.query.name as string;
    let id = req.query.id as string;

    const updateData = req.body;

    if (name) {
        name = name.toLowerCase();
        await handleRequest(req, res, () => updateProductByName(name, updateData), PRODUCT_UPDATE_ERROR_MSG)
    } else if (id) {
        await handleRequest(req, res, () => updateProductByName(id, updateData), PRODUCT_UPDATE_ERROR_MSG)
    }
}

export const deleteById = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await handleRequest(req, res, () => deleteProduct(id), PRODUCT_DELETION_ERROR_MSG)
}
