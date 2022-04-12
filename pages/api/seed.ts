// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { db,seedDatabase } from "../../database";
import { Product, User } from "../../models";

type Data = {
  message: string;
};

export default async function  handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return populateDB(req, res);
  }
}

export const populateDB = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.NODE_ENV === "production") return res.status(404).json({message: "No tiene authorizacion a este endpoind"});
  try {
    await db.connect();
    await User.deleteMany({});
    await User.insertMany(seedDatabase.initialData.users)
    await Product.deleteMany()
    await Product.insertMany(seedDatabase.initialData.products);
    await db.disconnect();
    res.status(200).json({ message: "Database poblada con exito" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Ocurrio un error al intentar poblar la db" });
  }
};
