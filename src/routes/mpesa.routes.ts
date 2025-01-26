//lipaRoute.ts
import express from "express";
import { handleStkPush } from "../controller/mpesa.controller";
import { generateToken } from "../middleware/generateToken";
const mpesaRouter = express.Router();
mpesaRouter.post("/", generateToken, handleStkPush);
export default mpesaRouter;
