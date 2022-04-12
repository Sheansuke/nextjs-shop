import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'

import useSWR from 'swr'
import { useProducts } from '../../hooks'
import { FullScreenLoading } from '../../components/ui'




const WomenPage: NextPage = () => {
    const { products, isError, isLoading } = useProducts("/products?gender=women")



    return (
        <ShopLayout
            title='Nextjs Shop - women category'
            pageDescription='Encuentra los mejores productos de Teslo Shop para mujeres'

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

export default WomenPage
