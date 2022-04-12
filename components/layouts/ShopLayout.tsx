import Head from 'next/head'
import React, { FC } from 'react'
import { Navbar, SideMenu } from '../ui'

interface IShopLayoutProps {
    title: string
    pageDescription?: string
    imgFullUrl?: string
}

export const ShopLayout: FC<IShopLayoutProps> = React.memo(function ShopLayout({ title, pageDescription, imgFullUrl, children }) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={pageDescription} />
                {imgFullUrl && <meta property="og:image" content={imgFullUrl} />}
            </Head>

            <nav>
                <Navbar />
            </nav>

            <SideMenu />

            <main
                style={{
                    margin: "80px auto",
                    maxWidth: "1440px",
                    padding: "0px 30px"
                }}
            >{children}</main>

            <footer>
                {/* footer */}
            </footer>
        </>
    )
})
