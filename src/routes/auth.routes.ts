import { Router } from "express";
import { asyncHandler } from "../utils";
import { register } from "../controller/auth.controller";
import { userValidationSchema } from "../middleware/validators/user.validator";

const authRouter = Router();

authRouter.post('/register', userValidationSchema, asyncHandler(register))

export default authRouter;
