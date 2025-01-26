import express from "express";
import { handleCallback, handleStkPush } from "../controller/mpesa.controller";
import { generateToken } from "../middleware/generateToken";

const mpesaRouter = express.Router();

mpesaRouter.post("/", generateToken, handleStkPush);
mpesaRouter.post('/callback', handleCallback);

export default mpesaRouter;
