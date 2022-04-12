import type { NextApiRequest, NextApiResponse } from "next";
import { db , SHOP_CONSTANTS} from "../../../database";
import { Product } from "../../../models";
import { IProduct } from "../../../interfaces/IProduct";

type Data =
  | {
      message: string;
    }
  | IProduct[];

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    default:
      return res.status(405).json({ message: "Bad request" });
  }

  res.status(200).json({ message: "Example" });
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender = "all" } = req.query;

  let condition = {};

  if (gender !== "all" && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
    condition = { gender };
  }

  try {
    await db.connect();
    const products = await Product.find(condition)
      .select("title images price inStock slug -_id")
      .lean();
    await db.disconnect();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los datos" });
  }
};
