import { Request, Response } from 'express'
import { handleRequest } from '../utils'
import {
  addToCart,
  deleteItem,
  updateItemQuantity,
} from '../services/cart.service'

const ADD_TO_CART_ERROR_MSG = 'cart.controller: Error adding item to cart'
const UPDATE_ITEM_ERROR_MSG = 'cart.controller: Error updating cart item'
const DELETE_ITEM_ERROR_MSG = 'cart.controller: Error deleting cart item'

export const addProductToCart = async (req: Request, res: Response) => {
  const { product, userId } = req.body

  await handleRequest(
    req,
    res,
    () => addToCart(userId, product),
    ADD_TO_CART_ERROR_MSG,
  )
}

export const updateQuantity = async (req: Request, res: Response) => {
  const { cartItemId, quantity } = req.body

  await handleRequest(
    req,
    res,
    () => updateItemQuantity(cartItemId, quantity),
    UPDATE_ITEM_ERROR_MSG,
  )
}

export const removeFromCart = async (req: Request, res: Response) => {
  const { itemId } = req.params

  await handleRequest(req, res, () => deleteItem(itemId), DELETE_ITEM_ERROR_MSG)
}
