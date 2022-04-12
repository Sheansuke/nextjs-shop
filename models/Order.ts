import mongoose, { Schema, Model, model } from "mongoose";
import { IOrder } from "../interfaces";

const orderSchema = new Schema(
  {
    user            : { type: Schema.Types.ObjectId, ref: "User", required: true },
    numberOfItems   : { type: Number, required: true },
    subtotal        : { type: Number, required: true },
    tax             : { type: Number, required: true },
    total           : { type: Number, required: true },
    isPaid          : { type: Boolean, required: true, default: false },
    paidAt          : { type: String},
    orderItems: [
      {
        _id         : { type: Schema.Types.ObjectId, ref: "Product",required: true },
        title       : { type: String, required: true },
        sizes        : { type: String, required: true },
        quantity    : { type: String, required: true },
        slug        : { type: String, required: true },
        images       : { type: String, required: true },
        price       : { type: Number, required: true },
      },
    ],
    shippingAddress: {
        name        : { type: String, required: true },
        lastName    : { type: String, required: true },
        address     : { type: String, required: true },
        address2    : { type: String},
        zip         : { type: String, required: true },
        city        : { type: String, required: true },
        country     : { type: String, required: true },
        phone       : { type: String, required: true },
    },
    transactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order || model<IOrder>("Order", orderSchema);

export default Order;
