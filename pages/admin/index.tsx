import {
    DashboardOutlined,
    CreditCardOffOutlined,
    AttachMoneyOutlined,
    GroupOutlined,
    CategoryOutlined,
    CancelPresentationOutlined,
    ProductionQuantityLimitsOutlined,
    AccessTimeFilledOutlined,
    AccessTimeOutlined,
} from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { SummaryTile } from "../../components/admin/SummaryTile";
import useSWR from "swr";
import { DashboardSummaryResponse } from "../../interfaces";

interface ISummaryTileProps {
    title: string | number;
    subTitle: string;
    icon: JSX.Element;
}

const DashboardPage: NextPage = () => {
    const { data, error } = useSWR<DashboardSummaryResponse>(
        "/api/admin/dashboard",
        { refreshInterval: 30 * 1000 }
    );

    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshIn((refreshIn) => refreshIn > 0 ? refreshIn - 1 : 30);

        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!error && !data) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.log("🚀 ~ file: index.tsx ~ line 24 ~ error", error);
        return <Typography>Error al cargar la informacion</Typography>;
    }

    const {
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    } = data!;

    const summaryTiles: ISummaryTileProps[] = [
        {
            title: numberOfOrders,
            subTitle: "Ordenes Totales",
            icon: (
                <CreditCardOffOutlined
                    color="secondary"
                    sx={{
                        fontSize: 40,
                    }}
                />
            ),
        },
        {
            title: paidOrders,
            subTitle: "Ordenes Pagadas",
            icon: (
                <AttachMoneyOutlined
                    color="success"
                    sx={{
                        fontSize: 40,
                    }}
                />
            ),
        },
        {
            title: notPaidOrders,
            subTitle: "Ordenes Pendientes",
            icon: (
                <CreditCardOffOutlined
                    color="error"
                    sx={{
                        fontSize: 40,
                    }}
                />
            ),
        },
        {
            title: numberOfClients,
            subTitle: "Clientes",
            icon: (
                <GroupOutlined
                    color="error"
                    sx={{
                        fontSize: 40,
                    }}
                />
            ),
        },
        {
            title: numberOfProducts,
            subTitle: "Productos",
            icon: (
                <CategoryOutlined
                    color="error"
                    sx={{
                        fontSize: 40,
                    }}
                />
            ),
        },
        {
            title: productsWithNoInventory,
            subTitle: "Sin Existencias",
            icon: (
                <CancelPresentationOutlined
                    color="warning"
                    sx={{
                        fontSize: 40,
                    }}
                />
            ),
        },
        {
            title: lowInventory,
            subTitle: "Bajo inventario",
            icon: (
                <ProductionQuantityLimitsOutlined
                    color="warning"
                    sx={{
                        fontSize: 40,
                    }}
                />
            ),
        },
        {
            title: refreshIn,
            subTitle: "Actualizaicon en:",
            icon: (
                <AccessTimeOutlined
                    color="secondary"
                    sx={{
                        fontSize: 40,
                    }}
                />
            ),
        },
    ];

    return (
        <AdminLayout
            title="Dashboard"
            subtitle="Estadisticas generales"
            icon={<DashboardOutlined />}
        >
            <Grid container spacing={2}>
                {summaryTiles.map((tile, index) => (
                    <SummaryTile
                        key={index}
                        title={tile.title}
                        subTitle={tile.subTitle}
                        icon={tile.icon}
                    />
                ))}
            </Grid>
        </AdminLayout>
    );
};

export default DashboardPage;
