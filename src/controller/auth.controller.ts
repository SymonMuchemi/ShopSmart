import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { createUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { code, message, details } = await createUser(req.body);

        return res.status(code).json({ message, details });
    } catch (error: any) {
        return res.status(500).json({
            message: "auth.controller: Error registering user",
            details: error.toString()
        })
    }
}
