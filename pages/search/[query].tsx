import { Typography } from "@mui/material";
import type { NextPage } from "next";
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from "next";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { dbProducts } from "../../database";
import { useProducts } from "../../hooks";
import { IProduct } from "../../interfaces";

interface SearchPageProps {
    products: IProduct[];
    term: string
}

const SearchPage: NextPage<SearchPageProps> = ({ products, term }) => {
    return (
        <ShopLayout
            title="Nextjs Shop - Search"
            pageDescription="Encuentra los mejores productos de Teslo Shop"
        >
            <Typography variant="h1" component="h1">
                Buscar producto
            </Typography>
            <Typography
                variant="h2"
                sx={{
                    mb: 1,
                }}
            >
                {term}
            </Typography>

            {
                products.length > 0 ? <ProductList products={products} /> : <h1>Products found...</h1>
            }
        </ShopLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query = "" } = params as { query: string };
    const products = await dbProducts.getProductsByTerm(query);

    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    return {
        props: {
            products,
            term: query
        },
    };
};

export default SearchPage;
