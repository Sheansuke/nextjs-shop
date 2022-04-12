import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import { NextPage, GetServerSideProps } from 'next';
import React, { useContext, useState } from "react";
import { AuthLayout } from "../../components/layouts/AuthLayout";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import tesloapi from "../../api/tesloApi";
import { getSession, signIn } from "next-auth/react";
import { validations } from "../../utils";
import { ErrorOutline } from "@mui/icons-material";
import { useRouter } from "next/router";
import { AuthContext } from "../../context";


type FormData = {
    name: string;
    email: string;
    password: string;
};

const RegisterPage: NextPage = () => {
    const router = useRouter()
    const { registerUser } = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },

    } = useForm<FormData>();
    const [showError, setShowError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");


    const destination = router.query.p as string || "/";

    const onRegisterForm = async ({ name, email, password }: FormData) => {
        setShowError(false);

        const { hasError, message } = await registerUser(name, email, password);
        if (hasError) {
            setShowError(true);
            setErrorMessage(message!);
            setTimeout(() => setShowError(false), 3000);
            return;
        }

        await signIn("credentials", {
            email,
            password,
        })
    };

    return (
        <AuthLayout title="Registro">
            <form onSubmit={handleSubmit(onRegisterForm)}>
                <Box
                    sx={{
                        width: 350,
                        padding: "10px 20px",
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} display="flex" flexDirection="column">
                            <Typography variant="h1" component="h1">
                                Crear Cuenta
                            </Typography>
                            {showError && <Chip

                                label="No se pudo crear el usuario intenta con otro email"
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{
                                    marginTop: 2,

                                }}
                            />}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Nombre" variant="filled"
                                {...register("name", {
                                    required: "Nombre es requerido",
                                    minLength: {
                                        value: 6,
                                        message: "Nombre debe tener al menos 6 caracteres",
                                    }
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Correo" variant="filled"
                                {...register("email", {
                                    required: "Email es requerido",
                                    validate: validations.isEmail,
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Contraseña"
                                variant="filled"
                                type="password"
                                {...register("password", {
                                    required: "Password es requerido",
                                    minLength: {
                                        value: 6,
                                        message: "Nombre debe tener al menos 6 caracteres",
                                    }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                color={isSubmitting ? "info" : "secondary"}
                                className="circular-btn"
                                size="large"
                                type="submit"
                                disabled={showError}


                            >
                                {isSubmitting ? "Creando..." : "Crear Cuenta"}
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <NextLink href={`/auth/login?p=${destination}`} passHref>
                                <Link
                                    underline="always"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    ya tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    );
};


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession({ req: ctx.req })

    const { p = "/" } = ctx.query as { p?: string };

    if (session) {
        return {
            redirect: {
                destination: p,
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default RegisterPage;
