import { Request, Response } from "express";
import { handleRequest } from "../utils";
import { createUser, authenticateUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
    await handleRequest(req, res, createUser, "auth.controller: Error registering user");
};

export const login = async (req: Request, res: Response) => {
    await handleRequest(req, res, authenticateUser, "auth.controller: Error logging in user");
};

