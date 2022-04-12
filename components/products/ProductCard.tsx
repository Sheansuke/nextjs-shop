import React, { FC, useMemo, useState } from "react"
import NextLink from "next/link";;
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from "@mui/material";
import { IProduct } from "../../interfaces";

interface IProductCardProps {
    product: IProduct;
}

export const ProductCard: FC<IProductCardProps> = ({ product }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

    const productImage = useMemo(() => {
        return isHovered ? `/products/${product.images[1]}` : `/products/${product.images[0]}`;
    }, [isHovered, product.images])

    return (
        <Grid key={product.slug} item
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card>
                <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
                    <Link>

                        <CardActionArea>
                            {
                                product.inStock === 0 && <Chip
                                    color="primary"
                                    label="No hay disponible"
                                    sx={{
                                        position: "absolute",
                                        top: 10,
                                        left: 10,
                                        zIndex: 1,
                                    }}
                                />
                            }
                            <CardMedia
                                component="img"
                                className="fadeIn"
                                image={productImage}
                                alt={product.title}
                                onLoad={() => setIsImageLoaded(true)}
                            />
                        </CardActionArea>
                    </Link>
                </NextLink>
            </Card>

            {
                isImageLoaded && <Box
                    sx={{
                        mt: 1,
                    }}
                    className="fadeIn"
                >
                    <Typography fontWeight={700}>{product.title}</Typography>
                    <Typography>$ {product.price}</Typography>
                </Box>
            }
        </Grid>
    );
};
