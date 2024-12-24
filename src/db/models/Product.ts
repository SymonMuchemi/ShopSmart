import mongoose, { Schema } from "mongoose";
import { IProduct } from "../../types";

const ProductSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);
