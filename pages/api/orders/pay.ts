import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { IPaypal } from "../../../interfaces";
import { db } from "../../../database";
import Order from '../../../models/Order';

type Data = {
  message: string;
};

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);

    default:
      return res.status(400).json({ message: "Bad Request" });
  }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;


  const base64Token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`, "utf-8").toString("base64");
  const body = new URLSearchParams("grant_type=client_credentials");
  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || "",
      body,
      {
        headers: {
        "Authorization": `Basic ${base64Token}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
      }
    );

    return data.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const paypalBearerToken = await getPaypalBearerToken();

    if (!paypalBearerToken) {
        return res.status(400).json({ message: "Paypal Bearer Token not found" });
    }

    const {transactionId = "", orderId = ""} = req.body;
    console.log("🚀 ~ file: pay.ts ~ line 55 ~ payOrder ~ transactionId", orderId)

    const {data} = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,{
        headers: {
            "Authorization": `Bearer ${paypalBearerToken}`
        }
    }) 
    
    if (data.status !== "COMPLETED") {
        return res.status(400).json({ message: "Payment not completed" });
    }


    await db.connect()
    const dbOrder = await Order.findById(orderId);
    if (!dbOrder) {
        await db.disconnect()
        return res.status(400).json({ message: "Order not found" });
    }

    if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
        await db.disconnect()
        return res.status(400).json({ message: "Order total is not correct" });
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    dbOrder.save();

    await db.disconnect()

  
    

  return res.status(200).json({ message: "Orden pagada" });
};
