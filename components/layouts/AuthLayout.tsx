import { Box } from "@mui/material";
import Head from "next/head";
import React, { FC } from "react";
import { Navbar, SideMenu } from "../ui";

interface IAuthLayout {
    title: string;
}

export const AuthLayout: FC<IAuthLayout> = ({ title, children }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta property="og:title" content={title} />
            </Head>

            <main>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="calc(100vh - 100px)"
                >
                    {children}
                </Box>
            </main>
        </>
    );
};
