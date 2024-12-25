import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types";

const UNAUTHORIZED_REQUEST = { message: "Unauthorized request" }
const ACCESS_DENIED = { message: "Access denied: admins only" }

export const authenticateToken = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(' ')[1];

    const accessTokenSecret = process.env.JWT_SECRET;

    //user is unauthorized
    if (!token || token === "null") {
        console.log(token);
        res.status(400).json(UNAUTHORIZED_REQUEST);
    } else if (!accessTokenSecret) {
        console.log("Access Token secret was missing in the env files");
        res.sendStatus(500);
    } else {
        try {
            let verifiedUser = jwt.verify(token, accessTokenSecret);
            req.user = verifiedUser;
            next();
        } catch (error) {
            res.status(403).json({ message: "Invalid or expired token" });
        }
    }
};

export const authorizeAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json(ACCESS_DENIED);
        return;
    }
    next();
}
