import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { NextPage } from "next";
import React from "react";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import useSWR from "swr";
import { IOrder } from "../../../interfaces/IOrder";
import { IUser } from '../../../interfaces/IUser';

const columns: GridColDef[] = [
    {
        field: "id",
        headerName: "Orden ID",
        width: 250,
    },
    {
        field: "email",
        headerName: "Correo",
        width: 250,
    },
    {
        field: "name",
        headerName: "Nombre",
        width: 250,
    },
    {
        field: "total",
        headerName: "Monto total",
        width: 250,
    },
    {
        field: "isPaid",
        headerName: "Pagada",
        width: 250,
        renderCell: ({ row }: GridValueGetterParams) => {
            return row.isPaid ? (
                <Chip label="Pagada" color="success" />
            ) : (
                <Chip label="No pagada" color="error" />
            );
        },
    },
    {
        field: "noProducts",
        headerName: "No.Productos",
        align: "center",
        width: 250,
    },
    {
        field: "check",
        headerName: "Ver Orden",
        width: 250,
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
                    Ver orden
                </a>
            );
        },
    },
];

const OrdersPage: NextPage = () => {
    const { data, error, mutate } = useSWR<IOrder[]>("/api/admin/orders");

    if (!error && !data) return <Typography>Loading...</Typography>;

    if (error) {
        console.log("🚀 ~ file: orders.tsx ~ line 67 ~ error", error);
        return <Typography>Error al cargar</Typography>;
    }

    const rows: any = data!.map((order: IOrder) => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        noProducts: order.numberOfItems,

    }));
    return (
        <AdminLayout
            title="Ordenes"
            subtitle="Listado de ordenes"
            icon={<ConfirmationNumberOutlined />}
        >
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
        </AdminLayout>
    );
};

export default OrdersPage;
