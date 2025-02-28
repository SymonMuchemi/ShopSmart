import { NextFunction, Request, Response } from "express";
import { asyncHandler, ErrorResponse, handleRequest } from "../utils";
import { User } from "../db/models";
import { IUser } from "../types";
import { getAwsSecrets } from "../config/secrets";

interface ExtendedRequest extends Request {
    user?: any;
}

// @desc    register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, role, phone } = req.body;

    const user = await User.create({
        name, email, password, role, phone
    });

    if (!user) return next(new ErrorResponse('Could not create new user', 500));

    await sendTokenResponse(user, 201, res);
});

// @desc    register a new user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) return next(new ErrorResponse('Please provide a valid email and password', 400));

    // check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) return next(new ErrorResponse('Invalid credentials', 401));

    const isMatch = user.matchPassword(password);

    if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));

    await sendTokenResponse(user, 200, res);
});

// @desc    get currect logged in user
// @route   GET /api/v1/auth/me
// @access  Public
export const getMe = asyncHandler(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
});

// @desc    Forgot password
// @route   GET /api/v1/auth/forgotpassword
// @access  Public
export const forgotpassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return next(new ErrorResponse(`No user found with email: ${req.body.email}`, 400));

    const resetToken = user.getPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        data: user
    })
})

const sendTokenResponse = async (user: IUser, statusCode: number, res: Response) => {
    const { JWT_EXPIRATION } = await getAwsSecrets();
    const token = await user.getSignedJwtToken();

    if (!token) throw new ErrorResponse('Could not create token', 500);

    const options = {
        expire: new Date(
            Date.now() + JWT_EXPIRATION * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: false
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}
