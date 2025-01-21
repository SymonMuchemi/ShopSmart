import { Router } from 'express'
import { asyncHandler } from '../utils'
import { register, login } from '../controller/auth.controller'
import {
  createUserSchema,
  validateUserSchema,
} from '../middleware/validators/user.validator'

const authRouter = Router()

authRouter.post('/register', createUserSchema, asyncHandler(register))
authRouter.post('/login', validateUserSchema, asyncHandler(login))

export default authRouter
