import { SizesType } from ".";

export interface ICartProduct {
  _id: string;
  images: string;
  price: number;
  sizes?: SizesType;
  slug: string;
  title: string;
  gender: string;
  quantity: number
}
