import { Request, Response } from "express";
import { handleRequest } from "../utils";
import { createProduct } from "../services/product.service";

export const create = async (req: Request, res: Response) => {
    await handleRequest(req, res, createProduct, "product.controller: Error creating product");
}
