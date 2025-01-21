import {
  createCartItem,
  deleteCartItem,
  updateCartItemQuantity,
} from '../db/utils'
import { IProduct, ReturnResponse } from '../types'

export const addToCart = async (
  userId: string,
  product: IProduct,
): Promise<ReturnResponse> => {
  try {
    const cartItem = await createCartItem(userId, product)

    if (!cartItem) {
      return {
        code: 400,
        message: 'cart.service: could not create cart item',
        details: 'db.utils.createCartItem returned null',
      }
    }

    return {
      code: 201,
      message: 'item added to cart successfully',
      details: cartItem,
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'cart.service: error adding item to cart',
      details: error.toString(),
    }
  }
}

export const updateItemQuantity = async (
  cartItemId: string,
  quantity: number,
): Promise<ReturnResponse> => {
  try {
    const updatedItem = await updateCartItemQuantity(cartItemId, quantity)

    if (!updatedItem) {
      return {
        code: 400,
        message: 'cart.service: could update item quantity',
        details: 'db.utils.updateCartItemQuantity returned null',
      }
    }

    return {
      code: 200,
      message: 'Item quantity successfully updated',
      details: updatedItem,
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'cart.service: error updating item quantity',
      details: error.toString(),
    }
  }
}

export const deleteItem = async (
  cartItemId: string,
): Promise<ReturnResponse> => {
  try {
    const deletedItem = await deleteCartItem(cartItemId)

    if (!deletedItem) {
      return {
        code: 400,
        message: 'cart.service: could delete item',
        details: 'db.utils.deleteCartItem returned null',
      }
    }

    return {
      code: 200,
      message: 'Item deleted successfully',
      details: deletedItem,
    }
  } catch (error: any) {
    return {
      code: 500,
      message: 'cart.service: error deleting item',
      details: error.toString(),
    }
  }
}
