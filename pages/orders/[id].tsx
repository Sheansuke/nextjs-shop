import { CreditCardOffOutlined, CreditCardOutlined } from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Typography,
} from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { dbOrders } from "../../database";
import { IOrder } from "../../interfaces/IOrder";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { IPaypal } from "../../interfaces";
import { tesloApi } from "../../api";
import { useRouter } from "next/router";

interface OrderPageProps {
    order: IOrder;
}

const OrderPage: NextPage<OrderPageProps> = ({ order }) => {
    const router = useRouter();
    const [isPaiying, setIsPaiying] = React.useState(false);
    const onOrderComplete = async (
        details: IPaypal.PaypalOrderStatusResponse
    ) => {
        if (details.status !== "COMPLETED") {
            return alert("Payment failed");
        }
        setIsPaiying(true);
        try {
            await tesloApi.post("/orders/pay", {
                transactionId: details.id,
                orderId: order._id,
            });

            router.reload();
        } catch (error) {
            setIsPaiying(false);
            console.log(error);
        }
    };

    return (
        <ShopLayout
            title="Resumen de orden 1"
            pageDescription="Resumen de la orden"
        >
            <Typography variant="h1" component="h1">
                Orden: {order._id}
            </Typography>

            {order.isPaid ? (
                <Chip
                    label="Pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditCardOutlined />}
                    sx={{ my: 2 }}
                />
            ) : (
                <Chip
                    label="Pendiente de pago"
                    variant="outlined"
                    color="error"
                    icon={<CreditCardOffOutlined />}
                    sx={{ my: 2 }}
                />
            )}

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList products={order.orderItems} />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant="h2">
                                Resumen ({order.numberOfItems} productos)
                            </Typography>

                            <Divider sx={{ my: 1 }} />

                            <Typography variant="subtitle1">Direccion de entrega</Typography>
                            <Typography>{order.shippingAddress.name}</Typography>
                            <Typography>
                                {order.shippingAddress.address}{" "}
                                {order.shippingAddress?.address2}
                            </Typography>

                            <Typography>{order.shippingAddress.country}</Typography>
                            <Typography>{order.shippingAddress.city}</Typography>
                            <Typography>{order.shippingAddress.zip}</Typography>
                            <Typography>{order.shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary order={order} />
                            {!order.isPaid && (
                                <Box
                                    sx={{
                                        mt: 3,
                                    }}
                                >
                                    <h1>Pagar</h1>
                                    {isPaiying ? (
                                        <Box display="flex" justifyContent="center">
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <PayPalButtons
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: `${order.total}`,
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions: any) => {
                                                return actions.order
                                                    .capture()
                                                    .then(
                                                        (details: IPaypal.PaypalOrderStatusResponse) => {
                                                            onOrderComplete(details);
                                                        }
                                                    );
                                            }}
                                        />
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({
    req,
    query,
}) => {
    const { id = "" } = query as { id: string };
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}}`,
                permanent: false,
            },
        };
    }

    const order = await dbOrders.getOrderById(id);

    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            },
        };
    }

    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            },
        };
    }

    return {
        props: {
            order,
        },
    };
};

export default OrderPage;
