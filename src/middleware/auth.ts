import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { asyncHandler } from '../utils';
import { ErrorResponse } from '../utils';
import { User } from '../db/models';
import { getAwsSecrets } from '../config/secrets';
import { ExtendedRequest } from '../types/response.type';

export const protect = asyncHandler(async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return next(new ErrorResponse('Not authorized to access this resource', 401));

    try {
        const { JWT_SECRET } = await getAwsSecrets();

        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === 'string' || !('id' in decoded)) return next(new ErrorResponse('Not authorized to access this resource', 401));

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        return next(new ErrorResponse('Not authorized to access this resource', 401));
    }
});

export const authorize = (...roles: string[]) => {
    return (req: ExtendedRequest, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User with role: ${req.user.role} has no access to this resource`, 403));
        }
        next();
    }
}
