import mongoose, { Schema } from "mongoose";
import { IProduct } from "../../types";
import { IMAGE_VIDEO_URL_REGEX } from "../../utils";

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
    category: {
        type: String,
        required: true
    },
    discount: {
        type: String,
    },
    imageUrls: {
        type: [String],
        validate: {
            validator: (v: string[]) => {
                v.every((url) => {
                    IMAGE_VIDEO_URL_REGEX.test(url)
                })
            },
            message: 'Each image url must be a valid URL!'
        },
    },
    videoUrl: {
        type: String,
        required: false,
        validate: {
            validator: (url: string) =>
                IMAGE_VIDEO_URL_REGEX.test(url),
            message: "The video URL must be a valid URL",
        },
    },
}, {
    timestamps: true
});

export default mongoose.model<IProduct>('Product', ProductSchema);
