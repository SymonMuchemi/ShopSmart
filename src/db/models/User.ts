import mongoose, { Schema } from "mongoose";
import { IUser } from "../../types";

const userSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: false
    }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);
