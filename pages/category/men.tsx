import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'

import useSWR from 'swr'
import { useProducts } from '../../hooks'
import { FullScreenLoading } from '../../components/ui'




const MenPage: NextPage = () => {
    const { products, isError, isLoading } = useProducts("/products?gender=men")



    return (
        <ShopLayout
            title='Nextjs Shop - men category'
            pageDescription='Encuentra los mejores productos de Teslo Shop para hombres'

        >
            <Typography variant="h1" component="h1" >Tienda</Typography>
            <Typography variant="h2"
                sx={{
                    mb: 1
                }}
            >Todos los productos:</Typography>

            {
                isLoading ? <FullScreenLoading /> : <ProductList products={products} />
            }
        </ShopLayout>
    )
}

export default MenPage
