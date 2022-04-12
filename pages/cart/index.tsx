import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import { NextPage } from "next";
import React, { useEffect } from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { useContext } from "react";
import { CartContext } from "../../context";
import { useRouter } from "next/router";

const CartPage: NextPage = () => {
    const router = useRouter();
    const { isLoaded, cart } = useContext(CartContext);

    useEffect(() => {
        if (cart.length === 0) {
            router.replace("/cart/empty");
        }
    }, [isLoaded, cart, router]);

    if (!isLoaded) {
        return <></>;
    }


    return (
        <ShopLayout title="Carrito - 3" pageDescription="Carrito de ocmpras">
            <Typography variant="h1" component="h1">
                Carrito
            </Typography>

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList isEditable />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">Orden</Typography>
                            <Divider sx={{ my: 1 }} />

                            <OrderSummary />
                            <Box
                                sx={{
                                    mt: 3,
                                }}
                            >
                                <Button fullWidth color="secondary" className="circular-btn" href="/checkout/address">
                                    Checkout
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default CartPage;
