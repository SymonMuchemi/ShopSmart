import express from "express";
import { 
  handleStkPush, 
  handleCallback, 
  confirmPaymentStatus, 
  handleTransactionStatusCallback 
} from "../controller/mpesa.controller";
import { generateToken } from "../middleware/generateToken";

const mpesaRouter = express.Router();

// Route for initiating an STK Push
mpesaRouter.post("/", generateToken, handleStkPush);

// Route for handling STK Push callbacks
mpesaRouter.post("/callback", handleCallback);

// Route for confirming payment status
mpesaRouter.post("/confirm", generateToken, confirmPaymentStatus);

// Route for handling transaction status callbacks
mpesaRouter.post("/transaction-status-callback", handleTransactionStatusCallback);

export default mpesaRouter;
