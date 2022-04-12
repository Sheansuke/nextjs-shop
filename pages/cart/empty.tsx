import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Link, Typography } from '@mui/material';
import React from 'react'
import NextLink from "next/link"
import { ShopLayout } from '../../components/layouts/ShopLayout';

const EmptyPage = () => {
    return (
        <ShopLayout title="Carrito vacio" pageDescription="No hay articulos" >
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="calc(100vh - 200px)"
                sx={{ flexDirection: { xs: "column", sm: "row" } }}
            >
                <RemoveShoppingCartOutlined sx={{
                    fontSize: 100
                }} />
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="h1" component="h1">Su carrito esta vacio</Typography>
                    <NextLink href="" passHref>
                        <Link typography="h4" color="secondary">
                            Regresar
                        </Link>
                    </NextLink>
                </Box>
            </Box>
        </ShopLayout>
    )
}

export default EmptyPage