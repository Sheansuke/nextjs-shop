import Product from "../models/Product";
import { db } from "./";
import { IProduct } from "../interfaces/IProduct";

export const getProductBySlug = async (
  slug: string
): Promise<IProduct | null> => {
  try {
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    return null;
  }
};


export const getAllProductSlugs = async (): Promise<{slug:string}[]> => {
await db.connect()

const slugs = await Product.find().select('slug -_id').lean()

await db.disconnect()

return slugs
}


export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
  try {
    await db.connect();
    const products = await Product.find({
      $text: { $search: term }
    }).select("title images price inStock slug -_id").lean();

    await db.disconnect();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    return [];
  }
}