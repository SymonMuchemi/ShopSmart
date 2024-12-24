import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ReturnResponse } from "../types";

export const asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
        (req: Request, res: Response, next: NextFunction) => {
            Promise.resolve(fn(req, res, next)).catch(next);
        };

export const handleRequest = async (
    req: Request,
    res: Response,
    serviceFunction: (data: any) => Promise<ReturnResponse>,
    errorMessage: string
) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { code, message, details } = await serviceFunction(req.body);
        return res.status(code).json({ message, details });
    } catch (error: any) {
        return res.status(500).json({
            message: errorMessage,
            details: error.toString(),
        });
    }
};
