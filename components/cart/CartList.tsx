import {
    Box,
    Button,
    CardActionArea,
    CardMedia,
    Grid,
    Link,
    Typography,
} from "@mui/material";
import React, { FC } from "react";
import { initialData } from "../../database/seed-data";
import NextLink from "next/link";
import { ItemCounter } from "../ui";
import { useContext } from "react";
import { CartContext } from "../../context";
import { ICartProduct } from '../../interfaces/ICart';
import { IOrderItem } from '../../interfaces/IOrder';


interface ICartListProps {
    isEditable?: boolean;
    products?: IOrderItem[]
}

export const CartList: FC<ICartListProps> = ({ isEditable = false, products = [] }) => {
    const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

    const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue;
        updateCartQuantity(product);
    }

    const onRemovecartProduct = (product: ICartProduct) => {
        removeCartProduct(product);
    }

    const productsToShow = products.length > 0 ? products : cart;
    return (
        <>
            {productsToShow.map((product) => (
                <Grid container key={product.slug + product.sizes} spacing={2} sx={{ mb: 1 }}>
                    <Grid item xs={3}>
                        <NextLink passHref href={`/product/${product.slug}`}>
                            <Link>
                                <CardActionArea>
                                    <CardMedia
                                        image={`/products/${product.images}`}
                                        component="img"
                                        alt={product.title}
                                        sx={{
                                            borderRadius: 5,
                                        }}
                                    />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display="flex" flexDirection="column">
                            <Typography variant="body1">{product.title}</Typography>
                            <Typography variant="body1">
                                Talla: <strong>{product.sizes}</strong>{" "}
                            </Typography>
                            {isEditable ? (
                                <ItemCounter
                                    currentValue={product.quantity}
                                    updatedQuantity={(value) => {
                                        onNewCartQuantityValue(product, value)
                                    }}
                                    maxValue={10}
                                />
                            ) : (
                                <Typography variant="h6">{product.quantity} {product.quantity > 1 ? "productos" : "producto"}</Typography>
                            )}
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                    >
                        <Typography variant="subtitle1">$ {product.price}</Typography>
                        {/* Editable */}
                        {isEditable && (
                            <Button variant="text" color="secondary" onClick={() => onRemovecartProduct(product)}>
                                Eliminar
                            </Button>
                        )}
                    </Grid>
                </Grid>
            ))}
        </>
    );
};
