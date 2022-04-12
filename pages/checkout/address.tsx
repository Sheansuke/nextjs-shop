import {
    Box,
    Button,
    FormControl,
    Grid,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { ShopLayout } from "../../components/layouts";
import { countries } from "../../utils";
import { useContext } from 'react';
import { CartContext } from "../../context";

type FormData = {
    name: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
};


const getAddressFromCookies = (): FormData => {
    return {
        name: Cookies.get("name") || "",
        lastName: Cookies.get("lastName") || "",
        address: Cookies.get("address") || "",
        address2: Cookies.get("address2") || "",
        zip: Cookies.get("zip") || "",
        city: Cookies.get("city") || "",
        country: Cookies.get("country") || countries.countries[0].code,
        phone: Cookies.get("phone") || "",

    }
}

const AddressPage: NextPage = () => {
    const { updateAddress } = useContext(CartContext);
    const router = useRouter();
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: getAddressFromCookies(),
    });



    const onChecktOrder = (data: FormData) => {
        updateAddress(data)
        router.push("/checkout/summary");
    };

    return (
        <ShopLayout
            title="Direccion"
            pageDescription="Confirmar direccion del destino"
        >
            <form onSubmit={handleSubmit(onChecktOrder)}>
                <Typography variant="h1" component="h1">
                    Direccion
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            variant="filled"
                            {...register("name", {
                                required: "El nombre es requerido",
                            })}
                            error={!!errors.name}
                            helperText={errors.name && errors.name.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Apellido"
                            variant="filled"
                            {...register("lastName", {
                                required: "El apellido es requerido",
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName && errors.lastName.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Direccion"
                            variant="filled"
                            {...register("address", {
                                required: "la direccion es requerida",
                            })}
                            error={!!errors.address}
                            helperText={errors.address && errors.address.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Direccion 2 (opcional)"
                            variant="filled"
                            {...register("address2")}
                            error={!!errors.address2}
                            helperText={errors.address2 && errors.address2.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Codigo Postal"
                            variant="filled"
                            {...register("zip", {
                                required: "El Codigo Postal es requerido",
                            })}
                            error={!!errors.zip}
                            helperText={errors.zip && errors.zip.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Ciudad"
                            variant="filled"
                            {...register("city", {
                                required: "La ciudad es requerida",
                            })}
                            error={!!errors.city}
                            helperText={errors.city && errors.city.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth
                            {...register("country", {
                                required: "El pais es requerido",
                            })}
                            error={!!errors.country}
                        >
                            <Select
                                variant="filled"
                                label="Pais"
                                value={"CRI"}


                            >
                                {countries.countries.map((country) => (
                                    <MenuItem key={country.code} value={country.code}>
                                        {country.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Telefono" variant="filled"
                            {...register("phone", {
                                required: "El telefono es requerido",
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone && errors.phone.message}
                        />
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        mt: 5,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Button
                        type="submit"
                        color="secondary"
                        className="circular-btn"
                        size="large"
                    >
                        Revisar pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    );
};

export default AddressPage;
