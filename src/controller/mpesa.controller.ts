import axios from "axios";
import { Response, Request } from "express";
import { RequestExtended } from "../middleware/generateToken";
import { color } from "console-log-colors";
import { timestamp } from "../mpesa/timeStamps";
import { getNgrokUrl } from "../ngrok/init";

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
  const { transactionId } = req.body; // Mpesa Receipt Number
  const BUSINESS_SHORT_CODE = process.env.MPESA_BUSINESS_SHORT_CODE as string;
  const INITIATOR_NAME = process.env.MPESA_INITIATOR_NAME as string;
  const SECURITY_CREDENTIAL = process.env.MPESA_SECURITY_CREDENTIAL as string; // Encrypted password

  const ngrokUrl = getNgrokUrl();
  const resultUrl = `${ngrokUrl}/api/v1/mpesa/transaction-status-callback`;
  const timeoutUrl = `${ngrokUrl}/api/v1/mpesa/timeout`;

  const payload = {
    Initiator: INITIATOR_NAME,
    SecurityCredential: SECURITY_CREDENTIAL,
    CommandID: "TransactionStatusQuery",
    TransactionID: transactionId,
    PartyA: BUSINESS_SHORT_CODE,
    IdentifierType: 4,
    ResultURL: resultUrl,
    QueueTimeOutURL: timeoutUrl,
    Remarks: "Payment confirmation",
    Occasion: "Payment",
  };

  try {
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/transactionstatus/v1/query",
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.token}`,
        },
      }
    );

    res.status(200).json({
      message: "Transaction status query initiated successfully",
      data: response.data,
    });
  } catch (error: any) {
    console.log(color.yellow.bold('Error on confirming payment status'))
    console.log(color.red(error.response.data.data));

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
