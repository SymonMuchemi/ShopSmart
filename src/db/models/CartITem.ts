import mongoose, { Schema } from "mongoose";
import { ICartItem } from "../../types";

const cartITemSchema: Schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    name: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: true
    },
    total_amount: {
        type: Number
    }
}, { timestamps: true });

export default mongoose.model<ICartItem>('CartITem', cartITemSchema);
