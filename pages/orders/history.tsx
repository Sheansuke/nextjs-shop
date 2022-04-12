import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import NextLink from "next/link";
import React from "react";
import { ShopLayout } from "../../components/layouts";
import { dbOrders } from "../../database";
import { IOrder } from '../../interfaces/IOrder';

const columns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        width: 100,
    },
    {
        field: "fullName",
        headerName: "Nombre Completo",
        width: 300,
    },
    {
        field: "paid",
        headerName: "Pagada",
        description: "Si la orden ha sido pagada o no",
        width: 200,
        renderCell: (params: GridValueGetterParams) => {
            return params.row.paid ? (
                <Chip color="success" label="Pagada" variant="outlined" />
            ) : (
                <Chip color="error" label="No pagada" variant="outlined" />
            );
        },
    },
    {
        field: "orden",
        headerName: "Ver orden",
        width: 200,
        sortable: false,
        renderCell: (params: GridValueGetterParams) => {
            return (
                <NextLink href={`/orders/${params.row._id}`} passHref>
                    <Link underline="always" color="secondary">Ver orden</Link>
                </NextLink>
            );
        },
    },
];




interface HistoryPageProps {
    orders: IOrder[]
}

const HistoryPage: NextPage<HistoryPageProps> = ({ orders }) => {
    console.log("🚀 ~ file: history.tsx ~ line 69 ~ orders", orders)
    const rows = orders.map((order: IOrder, index: number) => ({
        _id: order._id,
        id: index + 1,
        fullName: `${order.shippingAddress?.name} ${order.shippingAddress?.lastName}`,
        paid: order.isPaid,
    }))

    return (
        <ShopLayout
            title="Historial de ordenes"
            pageDescription="Historial de ordenes del cliente"
        >
            <Typography variant="h1" component="h1">
                Historial de ordenes
            </Typography>

            <Grid container>
                <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />
                </Grid>
            </Grid>
        </ShopLayout>
    );
};



export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: "/auth/login?p=/orders/history",
                permanent: false,
            }
        };
    }


    const orders = await dbOrders.getOrdersByUserId(session.user._id);

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage;
