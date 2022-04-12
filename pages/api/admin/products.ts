import type { NextApiRequest, NextApiResponse } from "next";
import { IProduct } from "../../../interfaces/IProduct";
import { db } from "../../../database";
import { Product } from "../../../models";
import { isValidObjectId } from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config( process.env.CLOUDINARY_URL || '' );

type Data =
  | {
      message: string;
    }
  | IProduct[]
  | any;

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    case "POST":
      return createProduct(req, res);

    case "PUT":
      return updateProduct(req, res);

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();
  const products = await Product.find().sort({ title: "asc" }).lean();
  await db.disconnect();

  res.status(200).json(products);
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    res.status(400).json({ message: "El id del producto no es valido" });
  }

  if (images.length < 2) {
    res.status(400).json({ message: "Es necesario almenos 2 imagenes" });
  }

  try {
    await db.connect();

    const product = await Product.findById(_id);

    if (!product) {
      await db.disconnect();
      res.status(400).json({ message: "No existe un producto con ese id" });
    }

    product?.images.forEach(async (image)=>{
      if (!images.includes(image)){
        const [fileId,extension]  = image.substring(image.lastIndexOf('/') + 1).split(".");
        console.log("🚀 ~ file: products.ts ~ line 66 ~ product?.images.forEach ~ fileId", fileId)
        await cloudinary.uploader.destroy(fileId)

      }
    })

    await product?.update(req.body);

    await db.disconnect();

    return res.status(200).json(product);
  } catch (error) {
    console.log("🚀 ~ file: products.ts ~ line 72 ~ error", error);
    await db.disconnect();
  }
};

const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    res
      .status(400)
      .json({ message: "El producto necesita almenos 2 imagenes" });
  }

  try {
    await db.connect();
    const productInDb = await Product.findOne({ slug: req.body.slug });
    if (productInDb) {
      await db.disconnect();
      res.status(400).json({ message: "Ya existe este producto" });
    }

    const product = await new Product(req.body);

    await product.save();

    await db.disconnect();

    res.status(201).json(product);

  } catch (error) {
    console.log(
      "🚀 ~ file: products.ts ~ line 88 ~ createProduct ~ error",
      error
    );
    await db.disconnect();
    res.status(400).json({ message: "Revisar logs" });
  }
};
