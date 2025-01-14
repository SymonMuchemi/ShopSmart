import mongoose, { Schema } from "mongoose";
import { IPurchase, PurchaseItem } from "../../types/models.types";
import { PURCHASE_STATUS_ENUM } from "../utils";

const purchaseSchema: Schema = new Schema({
    items: [{
        type: {
            productId: mongoose.Types.ObjectId,
            quantity: Number
        }
    }],
    status: {
        type: String,
        enum: PURCHASE_STATUS_ENUM,
        default: PURCHASE_STATUS_ENUM[1]
    }
}, {
    timestamps: true
});

export default mongoose.model<IPurchase>('Purchase', purchaseSchema);
