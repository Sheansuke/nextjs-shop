import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import {
    Box,
    AppBar,
    Link,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Badge,
} from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useContext } from "react";
import { CartContext, UiContext } from "../../context";
import { ApiSearchInput } from "./ApiSearchInput";

export const Navbar = () => {
    const { pathname } = useRouter();
    const { toggleSideMenu } = useContext(UiContext);
    const { numberOfItems } = useContext(CartContext);
    return (
        <AppBar>
            <Toolbar>
                <NextLink href="/" passHref>
                    <Link display="flex" alignItems="center">
                        <Typography variant="h6">Teslo |</Typography>
                        <Typography>Shop</Typography>
                    </Link>
                </NextLink>

                <Box flex={1.5} />

                <Box display={{ xs: "none", sm: "block" }}>
                    <NextLink href="/category/men" passHref>
                        <Link>
                            <Button color={pathname === "/category/men" ? "primary" : "info"}>
                                Hombres
                            </Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/women" passHref>
                        <Link>
                            <Button
                                color={pathname === "/category/women" ? "primary" : "info"}
                            >
                                Mujeres
                            </Button>
                        </Link>
                    </NextLink>

                    <NextLink href="/category/kid" passHref>
                        <Link>
                            <Button color={pathname === "/category/kid" ? "primary" : "info"}>
                                Niños
                            </Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box flex={1} />

                <Box>
                    <ApiSearchInput />
                </Box>

                <NextLink href="/cart" passHref>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={numberOfItems > 9 ? "+9" : numberOfItems} color="secondary">
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button onClick={toggleSideMenu}>Menu</Button>
            </Toolbar>
        </AppBar>
    );
};
