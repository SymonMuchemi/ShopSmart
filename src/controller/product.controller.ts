import { Request, Response } from 'express'
import { handleRequest } from '../utils'
import {
  fetchProductByNameOrId,
  fetchProducts,
  create as createProduct,
  updateProductByName,
  deleteProduct,
  deletesProductsWithEmptyImageArrays,
} from '../services/product.service'

const PRODUCT_CREATION_ERROR_MSG = 'product.controller: Error creating product'
const PRODUCT_FETCH_ERROR_MSG = 'product.controller: Error fetching products'
const PRODUCT_UPDATE_ERROR_MSG = 'product.controller: Error updating product'
const PRODUCT_DELETION_ERROR_MSG = 'product.controller: Error deleting product'

export const create = async (req: Request, res: Response) => {
  const product = req.body
  const files = (req.files as Express.Multer.File[]) || []
  await handleRequest(
    req,
    res,
    () => createProduct(product, files),
    PRODUCT_CREATION_ERROR_MSG,
  )
}
export const findAll = async (req: Request, res: Response) => {
  const page = Number.parseInt(req.query.page as string) || 1
  const limit = Number.parseInt(req.query.limit as string) || 10

  const productName = req.query.name as string
  const category = req.query.category as string
  const id = req.query.id as string

  if (id !== undefined) {
    await handleRequest(
      req,
      res,
      () => fetchProductByNameOrId(productName, (id)),
      PRODUCT_FETCH_ERROR_MSG,
    )
  } else if (productName !== undefined) {
    await handleRequest(
      req,
      res,
      () => fetchProductByNameOrId((productName)),
      PRODUCT_FETCH_ERROR_MSG,
    )
  } else if (category !== undefined) {
    await handleRequest(
      req,
      res,
      () => fetchProducts(page, limit, (category)),
      PRODUCT_FETCH_ERROR_MSG,
    )
  } else {
    await handleRequest(
      req,
      res,
      () => fetchProducts(),
      PRODUCT_FETCH_ERROR_MSG,
    )
  }
}

export const updateByName = async (req: Request, res: Response) => {
  let name = req.query.name as string
  const id = req.query.id as string

  const updateData = req.body

  if (name) {
    name = name.toLowerCase()
    await handleRequest(
      req,
      res,
      () => updateProductByName(name, updateData),
      PRODUCT_UPDATE_ERROR_MSG,
    )
  } else if (id) {
    await handleRequest(
      req,
      res,
      () => updateProductByName(id, updateData),
      PRODUCT_UPDATE_ERROR_MSG,
    )
  }
}

export const deleteById = async (req: Request, res: Response) => {
  const id = req.params.id as string

  await handleRequest(
    req,
    res,
    () => deleteProduct(id),
    PRODUCT_DELETION_ERROR_MSG,
  )
}

export const deleteImageLess = async (req: Request, res: Response) => {
  await handleRequest(
    req,
    res,
    deletesProductsWithEmptyImageArrays,
    PRODUCT_DELETION_ERROR_MSG,
  )
}
