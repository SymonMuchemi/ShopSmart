import mongoose, { Schema } from "mongoose";
import { IUser } from "../../types";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import { getAwsSecrets } from "../../config/secrets";

const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: false
    },
    phone: {
        type: Number,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true
});

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);

    // set password to hashed value
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.getSignedJwtToken = async function () {
    const { JWT_SECRET, JWT_EXPIRATION } = await getAwsSecrets();

    const token = jwt.sign({ id: this._id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION
    });

    if (!token) throw new Error("Could not create token");

    return token;
}

userSchema.methods.matchPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.getPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // set reset token expiry
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

export default mongoose.model<IUser>('User', userSchema);
