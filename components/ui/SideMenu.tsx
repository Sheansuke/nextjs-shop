import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import {
    AccountCircleOutlined,
    AdminPanelSettings,
    CategoryOutlined,
    ConfirmationNumberOutlined,
    EscalatorWarningOutlined,
    FemaleOutlined,
    LoginOutlined,
    MaleOutlined,
    VpnKeyOutlined,
} from "@mui/icons-material";
import { useContext } from "react";
import { UiContext } from "../../context";
import { ApiSearchInput } from "./ApiSearchInput";
import { AuthContext } from "../../context/auth/AuthContext";
import { useRouter } from "next/router";
import NextLink from 'next/link';
import { DashboardOutlined } from '@mui/icons-material';

export const SideMenu = () => {
    const router = useRouter()
    const { isLoggedIn, user, logout } = useContext(AuthContext);
    const isAdmin = user?.role === "admin";
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);

    const onLogout = () => {
        logout();
    };

    const navigateTo = (url: string) => {
        router.push(url);
        toggleSideMenu();

    }

    return (
        <Drawer
            open={isMenuOpen}
            anchor="right"
            sx={{ backdropFilter: "blur(4px)", transition: "all 0.5s ease-out" }}
            onClose={toggleSideMenu}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>
                <List>
                    <ApiSearchInput onSearch={toggleSideMenu} />

                    <ListItem button>
                        <ListItemIcon>
                            <AccountCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Perfil"} />
                    </ListItem>


                    <ListItem button onClick={() => navigateTo("/orders/history")}>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Mis Ordenes"} />
                    </ListItem>


                    <ListItem button sx={{ display: { xs: "", sm: "none" } }}>
                        <ListItemIcon>
                            <MaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Hombres"} />
                    </ListItem>

                    <ListItem button sx={{ display: { xs: "", sm: "none" } }}>
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Mujeres"} />
                    </ListItem>

                    <ListItem button sx={{ display: { xs: "", sm: "none" } }}>
                        <ListItemIcon>
                            <EscalatorWarningOutlined />
                        </ListItemIcon>
                        <ListItemText primary={"Niños"} />
                    </ListItem>

                    {!isLoggedIn ? (
                        <NextLink href={`/auth/login?p=${router.asPath}`} >
                            <ListItem button onClick={toggleSideMenu}>
                                <ListItemIcon>
                                    <VpnKeyOutlined />
                                </ListItemIcon>
                                <ListItemText primary={"Ingresar"} />
                            </ListItem>
                        </NextLink>
                    ) : (
                        <ListItem button onClick={onLogout}>
                            <ListItemIcon>
                                <LoginOutlined />
                            </ListItemIcon>
                            <ListItemText primary={"Salir"} />
                        </ListItem>
                    )}

                    {/* Admin */}
                    {isAdmin && (
                        <>
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItem button onClick={() => navigateTo("/admin")}>
                                <ListItemIcon>
                                    <DashboardOutlined />
                                </ListItemIcon>
                                <ListItemText primary={"Dashboard"} />
                            </ListItem>
                            <ListItem button onClick={() => navigateTo("/admin/products")}>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined />
                                </ListItemIcon>
                                <ListItemText primary={"Productos"} />
                            </ListItem>
                            <ListItem button onClick={() => navigateTo("/admin/orders")}>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined />
                                </ListItemIcon>
                                <ListItemText primary={"Ordenes"} />
                            </ListItem>

                            <ListItem button onClick={() => navigateTo("/admin/users")}>
                                <ListItemIcon>
                                    <AdminPanelSettings />
                                </ListItemIcon>
                                <ListItemText primary={"Usuarios"} />
                            </ListItem>
                        </>
                    )}
                </List>
            </Box>
        </Drawer>
    );
};
