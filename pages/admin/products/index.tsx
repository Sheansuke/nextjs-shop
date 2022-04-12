import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { Box, Button, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { NextPage } from "next";
import React from "react";
import { AdminLayout } from "../../../components/layouts/AdminLayout";
import useSWR from "swr";
import { IProduct } from '../../../interfaces/IProduct';
import NextLink from 'next/link';

const columns: GridColDef[] = [
    {
        field: "img",
        headerName: "Foto",
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <img
                    src={`/products/${row.img}`}
                    style={{ width: "100px", height: "100px" }}
                    alt="product"
                />
            );
        }
    },
    {
        field: "title",
        headerName: "Titulo",
        width: 250,
        renderCell: ({ row }: GridValueGetterParams) => <NextLink href={`/admin/products/${row.slug}`} passHref>
            <Link underline="always" color="secondary">
                {row.title}
            </Link>
        </NextLink>
    },
    {
        field: "gender",
        headerName: "Genero",
    },
    {
        field: "type",
        headerName: "Tipo",
    },
    {
        field: "inStock",
        headerName: "Inventario",
    },
    {
        field: "price",
        headerName: "Precio",
    },
    {
        field: "sizes",
        headerName: "tallas",
        width: 250,
    },
];

const ProductsPage: NextPage = () => {
    const { data, error, mutate } = useSWR<IProduct[]>("/api/admin/products");

    if (!error && !data) return <Typography>Loading...</Typography>;

    if (error) {
        console.log("🚀 ~ file: products.tsx ~ line 50 ~ error", error)
        return <Typography>Error al cargar</Typography>;
    }

    const rows: any = data!.map((product: IProduct) => ({
        id: product._id,
        img: product.images[0],
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes
    }));
    return (
        <AdminLayout
            title={`Productos: ${data!.length}`}
            subtitle="Mantenimiento de productos"
            icon={<CategoryOutlined />}
        >
            <Box display="flex" justifyContent="end" sx={{ mb: 2 }}>
                <Button startIcon={<AddOutlined />} color="secondary"
                    href="/admin/products/new"
                >
                    Crear producto
                </Button>

            </Box>
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

export default ProductsPage;
