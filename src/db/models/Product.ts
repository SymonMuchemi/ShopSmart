import mongoose, { Schema } from "mongoose";
import { IProduct } from "../../types";
import { IMAGE_VIDEO_URL_REGEX } from "../../utils";
import slugify from "slugify";

const ProductSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: String,
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
    imageNames: {
        type: [String],
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

ProductSchema.pre<IProduct>('save', function (next) {
    try {
        // convert strings to lower case
        this.name = this.name.toLowerCase();
        this.category = this.category.toLowerCase(); 
    
        // create product slug
        this.slug = slugify(this.name, { lower: true, trim: true, replacement: '-'});
    
        next();
    } catch (error) {
        
    }
});



export default mongoose.model<IProduct>('Product', ProductSchema);
