import mongoose, { Schema, Model, model } from "mongoose";
import { IProduct } from "../interfaces";

const productSchema = new Schema(
  {
    description: { type: String, required: true, default: "" },
    images: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [
      {
        type: String,
        enum: {
          values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
          message: "`{VALUE}` No es un valor permitido",
        },
      },
    ],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    title: { type: String, required: true , default: ""},
    type: {
      type: String,
      enum: {
        values: ["shirts", "pants", "hoodies", "hats"],
        message: "`{VALUE}` No es un valor permitido",
      }, default: "shirts"
    },
    gender: {
      type: String,
      enum: {
        values: ["men", "women", "kid", "unisex"],
        message: "`{VALUE}` No es un valor permitido",
      }, default: "women"
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  title: "text",
  tags: "text"
})

const Product: Model<IProduct>  = mongoose.models.Product || model<IProduct>("Product", productSchema);

export default Product