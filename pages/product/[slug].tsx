import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ShopLayout } from "../../components/layouts";
import { ProductSlideShow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { dbProducts } from "../../database";
import { ICartProduct, SizesType } from "../../interfaces";
import { IProduct } from "../../interfaces/IProduct";
import { useContext } from 'react';
import { CartContext } from "../../context";

interface IProductPageProps {
    product: IProduct;


}

const ProductPage: NextPage<IProductPageProps> = ({ product }) => {
    const router = useRouter()

    const { addProductToCart } = useContext(CartContext)


    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        images: product.images[0],
        price: product.price,
        sizes: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1
    });

    const handleSelectedSize = (size: SizesType) => {
        setTempCartProduct(prevState => ({
            ...prevState,
            sizes: size
        }))
    }

    const onUpdateQuantity = (quantity: number) => {
        setTempCartProduct(prevState => ({
            ...prevState,
            quantity
        }))
    }

    const onAddProduct = () => {
        if (!tempCartProduct.sizes) return;
        addProductToCart(tempCartProduct)
        router.push("/cart")
    }

    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <ProductSlideShow images={product.images} />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Box display="flex" flexDirection="column">
                        <Typography variant="h1" component="h1">
                            {product.title}
                        </Typography>
                        <Typography variant="subtitle1" component="h2">
                            $ {product.price}
                        </Typography>

                        <Box sx={{ my: 2 }}>
                            <Typography variant="subtitle2" component="h2">
                                Cantidad
                            </Typography>
                            <ItemCounter
                                currentValue={tempCartProduct.quantity}
                                maxValue={product.inStock}
                                updatedQuantity={onUpdateQuantity}
                            />
                            <SizeSelector selectedSize={tempCartProduct.sizes} sizes={product.sizes} onSelectSize={handleSelectedSize} />
                        </Box>

                        {/* Agregar al carrito */}
                        {product.inStock > 0 ? (
                            <Button className="circular-btn" color="secondary" onClick={onAddProduct}>
                                {tempCartProduct.sizes ? "Agregar al carrito " : "Seleccionar talla"}
                            </Button>
                        ) : (
                            <Chip
                                color="error"
                                label="No hay disponible"
                                variant="outlined"

                            />
                        )}

                        {/* <Chip label="No disponible" color="error" variant="outlined" /> */}

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2">Descripcion</Typography>
                            <Typography variant="body2">{product.description}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const data = await dbProducts.getAllProductSlugs();

    return {
        paths: data.map(({ slug }) => ({ params: { slug } })),
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
    const slug = ctx.params?.slug;
    const product = await dbProducts.getProductBySlug(`${slug}`);

    if (!product) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return {
        props: {
            product,
        },
        revalidate: 86400,
    };
};

export default ProductPage;
