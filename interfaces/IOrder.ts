import { IUser } from "./";
import { SizesType } from "./IProduct";

export interface IOrder {
  _id?: string;
  user?: IUser | string;
  orderItems: IOrderItem[];
  shippingAddress: ShippingAdress;
  paymentResult?: string;

  numberOfItems: number;
  subtotal: number;
  tax: number;
  total: number;
  isPaid: boolean;
  paidAt?: string;
  transactionId?: string;
}

export interface IOrderItem {
  _id: string;
  images: string;
  price: number;
  sizes?: SizesType;
  slug: string;
  title: string;
  gender: string;
  quantity: number
}

export interface ShippingAdress {
  name: string;
  lastName: string;
  address: string;
  address2?: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
}
