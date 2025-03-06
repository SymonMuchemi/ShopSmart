import { Router } from "express";
import { createUserSchema, validateUserSchema } from "../middleware/validators/user.validator";
import { protect } from "../middleware/auth";
import {
    register,
    login,
    getMe
} from "../controller/auth.controller";

const authRouter = Router();

authRouter.post('/register', createUserSchema, register);
authRouter.post('/login', validateUserSchema, login);
authRouter.get('/getme', protect, getMe);

export default authRouter;
