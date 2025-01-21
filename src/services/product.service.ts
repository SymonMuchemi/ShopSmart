import { Product } from '../db/models'
import {
  createProduct,
  deleteProductsWithNoImages,
  fetchAll,
} from '../db/utils'
import { IProduct, ReturnResponse, UpdateProduct } from '../types'
import { deleteProductImages } from '../utils'
import { fetchByNameOrId } from '../db/utils'
import { param } from '../types/response.type'

export const create = async (
  product: IProduct,
  files: Express.Multer.File[],
): Promise<ReturnResponse> => {
  try {
    const newProduct = await createProduct(product, files)

    return {
      code: 201,
      message: 'Product created successfully',
      details: newProduct,
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'product.service: error creating new product',
      details: error.toString(),
    }
  }
}

export const fetchProducts = async (
  page = 1,
  limit = 10,
  name: param = undefined,
  category: param = undefined,
): Promise<ReturnResponse> => {
  try {
    const productsData = await fetchAll(page, limit, category)

    return {
      code: 200,
      message: `Products found: ${productsData.metadata.total_items}`,
      details: productsData,
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'product.service: error fetching products',
      details: error.toString(),
    }
  }
}

export const fetchProductByNameOrId = async (
  productName: param = undefined,
  id: param = undefined,
): Promise<ReturnResponse> => {
  try {
    const product = await fetchByNameOrId(productName, id)

    if (product === null) {
      return {
        code: 404,
        message: 'Could not find product',
        details: `Product with ${productName ? 'name: ' + productName : 'id: ' + id} does not exist!`,
      }
    }

    return {
      code: 200,
      message: `Product found!`,
      details: product,
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'product.service: error fetching products',
      details: error.toString(),
    }
  }
}

export const updateProductByName = async (
  name: string,
  updateData: UpdateProduct,
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
      { new: true, runValidators: true },
    )

    if (!updatedProduct) {
      return {
        code: 400,
        message: 'Error updating product',
        details: `Could not find product with name ${name}`,
      }
    }

    return {
      code: 200,
      message: 'Product updated successfully',
      details: updatedProduct,
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'product.service: error updating product',
      details: error.toString(),
    }
  }
}

export const updateProductById = async (
  id: string,
  updateData: UpdateProduct,
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
      { new: true, runValidators: true },
    )

    if (!updatedProduct) {
      return {
        code: 400,
        message: 'Error updating product',
        details: `Could not find product with id ${id}`,
      }
    }

    return {
      code: 200,
      message: 'Product updated successfully',
      details: updatedProduct,
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'product.service: error updating product',
      details: error.toString(),
    }
  }
}

export const deleteProduct = async (id: string): Promise<ReturnResponse> => {
  try {
    const product = await Product.findOne({ _id: id })

    if (!product) {
      return {
        code: 400,
        message: 'Error deleting product',
        details: `Could not find product with id ${id}`,
      }
    }

    await deleteProductImages(product)

    const deletedProduct = await Product.deleteOne({ _id: id })

    if (!deleteProduct) {
      return {
        code: 400,
        message: 'Error deleting product',
        details: `Could not find product with id ${id}`,
      }
    }

    return {
      code: 200,
      message: 'Product deleted successfully',
      details: deletedProduct,
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'product.service: error deleting product',
      details: error.toString(),
    }
  }
}

export const deletesProductsWithEmptyImageArrays =
  async (): Promise<ReturnResponse> => {
    try {
      const deletedProducts = await deleteProductsWithNoImages()

      return {
        code: 200,
        message: 'Products deleted successfully',
        details: deletedProducts,
      }
    } catch (error: any) {
      return {
        code: 500,
        message: 'Error deleting products',
        details: error.toString(),
      }
    }
  }
