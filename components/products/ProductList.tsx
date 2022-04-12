import { Grid } from "@mui/material";
import React, { FC } from "react";
import { IProduct } from "../../interfaces";
import { ProductCard } from "./ProductCard";

interface IProductListProps {
    products: IProduct[];
}

export const ProductList: FC<IProductListProps> = ({ products }) => {
    return (
        <Grid container spacing={4}>
            {products.map((product) => (
                <Grid key={product.slug} item xs={12} sm={4}>
                    <ProductCard key={product.slug} product={product} />
                </Grid>
            ))}
        </Grid>
    );
};
