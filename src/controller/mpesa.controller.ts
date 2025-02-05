import axios from "axios";
import { Response, Request } from "express";
import { RequestExtended } from "../middleware/generateToken";
import { color } from "console-log-colors";
import { timestamp } from "../mpesa/timeStamps";
import { getNgrokUrl } from "../ngrok/init";

const BUSINESS_SHORT_CODE = process.env.MPESA_BUSINESS_SHORT_CODE as string;
const MPESA_PASS_KEY = process.env.MPESA_PASS_KEY;

const generate_stk_password = () => {
  return Buffer.from(
    BUSINESS_SHORT_CODE + MPESA_PASS_KEY + timestamp
  ).toString('base64');
}

const handleStkPush = async (req: RequestExtended, res: Response) => {
  const { phone, amount } = req.body;

  const password = generate_stk_password();
  const ngrokUrl = getNgrokUrl();
  const callbackUrl = `${ngrokUrl}/api/v1/mpesa/callback`;

  const payload = {
    BusinessShortCode: BUSINESS_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: BUSINESS_SHORT_CODE,
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

  console.log(color.magenta(JSON.stringify(req.body)));
  console.log("Callback received: ", callbackData);

  res.status(200).json(callbackData);
};

const confirmPaymentStatus = async (req: RequestExtended, res: Response) => {
  const { CheckoutRequestID } = req.body;

  const payload = {
    BusinessShortCode: BUSINESS_SHORT_CODE,
    Password: generate_stk_password(),
    Timestamp: timestamp,
    CheckoutRequestID
  }

  // setTimeout(() => {
  //   console.log('Waiting before sending payment confirmation request!');
  // }, 15000);

  try {
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.token}`,
        },
      }
    );

    console.log(color.red.bg1(`Response from confirm_status: ${response}`))

    res.status(200).json({
      message: "Transaction status query initiated successfully",
      data: response.data,
    });
  } catch (error: any) {
    console.log(color.yellow.bold('Error on confirming payment status'))
    console.log(color.red(`Error message ${error}`));

    res.status(500).json({
      message: "Transaction status query failed",
      error: error.message,
    });
  }
};

const handleTransactionStatusCallback = async (req: RequestExtended, res: Response) => {
  const callbackData = req.body;

  console.log(color.green("Transaction Status Callback: "), JSON.stringify(callbackData));

  // Handle and log the callback data
  if (callbackData.ResultCode === 0) {
    console.log("Payment confirmed successfully:", callbackData);
  } else {
    console.log("Payment confirmation failed:", callbackData);
  }

  res.status(200).json({ message: "Callback received", data: callbackData });
};

export { handleStkPush, handleCallback, confirmPaymentStatus, handleTransactionStatusCallback };
