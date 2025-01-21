import mongoose, { Schema } from 'mongoose'
import { ICartItem } from '../../types'

const cartITemSchema: Schema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
    },
    product_name: {
      type: String,
    },
    image_url: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    product_price: {
      type: Number,
      required: true,
    },
    total_amount: {
      type: Number,
    },
  },
  { timestamps: true },
)

export default mongoose.model<ICartItem>('CartITem', cartITemSchema)
