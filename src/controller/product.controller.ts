import { query, Request, Response } from "express";
import { handleRequest } from "../utils";
import {
    createProduct,
    fechAllProducts,
    fetchProductByName,
    fetchProductByCategory
} from "../services/product.service";

const PRODUCT_CREATION_ERROR_MSG = "product.controller: Error creating product";
const PRODUCT_FETCH_ERROR_MSG = "product.controller: Error fetching products";

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
