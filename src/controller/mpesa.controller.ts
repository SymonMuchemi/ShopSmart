import axios from "axios";
import { Response } from "express";
import { timestamp } from "../mpesa/timeStamps";
import { RequestExtended } from "../middleware/generateToken";
import ngrok from '@ngrok/ngrok';
import { color } from "console-log-colors";
import { getNgrokUrl, initializeNgrok } from "../ngrok/init";

const handleStkPush = async (req: RequestExtended, res: Response) => {
  const { phone, amount } = req.body;

  const BUSINESS_SHORT_CODE = process.env.MPESA_BUSINESS_SHORT_CODE as string;

  const password = Buffer.from(
    BUSINESS_SHORT_CODE + process.env.MPESA_PASS_KEY + timestamp
  ).toString("base64");


  const ngrokUrl = getNgrokUrl();
  const callbackUrl = `${ngrokUrl}/api/v1/mpesa/callback`;

  const payload = {
    BusinessShortCode: BUSINESS_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_BUSINESS_SHORT_CODE,
    PhoneNumber: phone,
    CallBackURL: callbackUrl,
    AccountReference: "BuySasa online shop",
    TransactionDesc: "Payment",
  };

  try {
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.token}`,
        },
      }
    );
    res.status(201).json({
      message: true,
      data: response.data,
    });
  } catch (error: any) {
    console.log(color.magenta(error.response.data));

    res.status(500).json({
      message: "Failed",
      error: error.message,
    });
  }
};

const handleCallback = async (req: RequestExtended, res: Response) => {
  const callbackData = req.body;

  console.log('Callback received: ', callbackData);

  res.status(200).json(callbackData);
}

export { handleStkPush, handleCallback };
