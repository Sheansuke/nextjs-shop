import { ErrorOutline } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    Link,
    TextField,
    Typography
} from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { getSession, signIn, getProviders } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthLayout } from "../../components/layouts/AuthLayout";
import { AuthContext } from "../../context/auth/AuthContext";
import { validations } from "../../utils";

type FormData = {
    email: string;
    password: string;
};

const LoginPage: NextPage = () => {
    const router = useRouter()
    const destination = router.query.p as string || "/";
    const {
        register,
        handleSubmit,

        formState: { errors },
    } = useForm<FormData>();

    const [showError, setShowError] = useState<boolean>(false);

    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
        getProviders().then(prov => {
            setProviders(prov);
        });

    }, [])



    const onLoginUser = async ({ email, password }: FormData) => {
        setShowError(false);
        await signIn("credentials", {
            email,
            password,
        })
    };

    return (
        <AuthLayout title="Ingresar">
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box
                    sx={{
                        width: 400,
                        padding: "10px 20px",
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} display="flex" flexDirection="column">
                            <Typography variant="h1" component="h1">
                                Iniciar Sesion
                            </Typography>
                            {showError && (
                                <Chip
                                    label="Usuario o contraseña incorrectos"
                                    color="error"
                                    icon={<ErrorOutline />}
                                    className="fadeIn"
                                    sx={{
                                        marginTop: 2,
                                    }}
                                />
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                fullWidth
                                label="Correo"
                                variant="filled"
                                {...register("email", {
                                    required: "El correo es requerido",
                                    validate: validations.isEmail,
                                })}
                                error={!!errors.email}
                                helperText={errors?.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Contraseña"
                                variant="filled"
                                type="password"
                                {...register("password", {
                                    required: "El password es requerido",
                                    minLength: {
                                        value: 6,
                                        message: "El password debe tener al menos 6 caracteres",
                                    },
                                })}
                                error={!!errors.password}
                                helperText={errors?.password?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                type="submit"
                                color="secondary"
                                className="circular-btn"
                                size="large"
                                disabled={showError}
                            >
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <NextLink href={`/auth/register?p=${destination}`} passHref>
                                <Link
                                    underline="always"
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    No tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{
                                width: "100%",
                                mb: 2,
                            }} />

                            {
                                Object.values(providers).map((provider: any) => {
                                    if (provider.id === "credentials") return;
                                    return (
                                        <Button key={provider.id}
                                            variant="outlined"
                                            fullWidth
                                            color="primary"
                                            sx={{ mb: 1 }}
                                            onClick={() => {
                                                signIn(provider.id);
                                            }}
                                        >{provider.name}</Button>
                                    )
                                })
                            }

                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout >
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

export default LoginPage;
