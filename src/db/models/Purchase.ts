import mongoose, { Schema } from "mongoose";
import { IPurchase } from "../../types/models.types";

const purchaseSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        type: {
            productId: String,
            quantity: Number,
        },
        required: true
    }],
    status: {
        type: String,
        enum: ['paid', 'declined', 'pending'],
        default: 'pending'
    },
    total_amount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model<IPurchase>('Purchase', purchaseSchema);
