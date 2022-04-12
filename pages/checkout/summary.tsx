import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Link,
    Typography,
} from "@mui/material";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import NextLink from "next/link";
import { useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const SummaryPage: NextPage = () => {
    const router = useRouter()
    const { shippingAddress, createOrder } = useContext(CartContext)

    const [isPosting, setIsPosting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (!Cookies.get("name")) {
            router.push("/checkout/address")
        }
    }, [router])

    const onCreateOrder = async () => {
        setIsPosting(true);
        const { hasError, message } = await createOrder()
        if (hasError) {
            setIsPosting(false);
            setErrorMessage(message)
            return;
        }

        router.replace(`/orders/${message}`)
    }

    return (
        <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
            <Typography variant="h1" component="h1">
                Resumen de la orden
            </Typography>

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">Resumen (3 productos)</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display="flex" justifyContent="end">
                                <NextLink href="/checkout/address" passHref>
                                    <Link underline="always" color="secondary">
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>
                            <Typography variant="subtitle1">Direccion de entrega</Typography>
                            <Typography >{shippingAddress?.name}</Typography>
                            <Typography >{shippingAddress?.address}</Typography>
                            <Typography >{shippingAddress?.address2}</Typography>
                            <Typography >{shippingAddress?.zip}</Typography>
                            <Typography >{shippingAddress?.phone}</Typography>
                            <Typography >{shippingAddress?.city}</Typography>
                            <Typography >{shippingAddress?.country}</Typography>


                            <Divider sx={{ my: 1 }} />
                            <Box display="flex" justifyContent="end">
                                <NextLink href="/cart" passHref>
                                    <Link underline="always" color="secondary">
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>
                            <OrderSummary />
                            <Box
                                sx={{
                                    mt: 3,
                                }}
                            >
                                <Button fullWidth color="secondary" className="circular-btn" onClick={onCreateOrder} disabled={isPosting}>
                                    Checkout
                                </Button>

                                {errorMessage && <Chip

                                    color="error"
                                    label={errorMessage}
                                    sx={{
                                        display: "flex",
                                        mt: 2,
                                    }}

                                />}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default SummaryPage;
