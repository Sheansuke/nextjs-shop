import { Box, AppBar, Link, Toolbar, Typography, Button } from "@mui/material";
import NextLink from "next/link";
import React from "react";
import { useContext } from "react";
import { UiContext } from "../../context";

export const AdminNavbar = () => {
    const { toggleSideMenu } = useContext(UiContext);

    return (
        <AppBar>
            <Toolbar>
                <NextLink href="/" passHref>
                    <Link display="flex" alignItems="center">
                        <Typography variant="h6">Nextjs |</Typography>
                        <Typography>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1.5} />

                <Button onClick={toggleSideMenu}>Menu</Button>
            </Toolbar>
        </AppBar>
    );
};
