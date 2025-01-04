import mongoose, { Schema } from 'mongoose';
import { ICart } from "../../types";

const CartSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    cartItems: [{
        type: Schema.Types.ObjectId,
        ref: 'CartItem'
    }],
    total_items: {
        type: Number,
        default: 0
    },
    total_amount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model<ICart>('Cart', CartSchema);
