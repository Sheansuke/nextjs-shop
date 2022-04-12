import axios from "axios";
import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect, useReducer } from "react";
import { tesloApi } from "../../api";
import { IUser } from "../../interfaces";
import { AuthContext, authReducer } from "./";

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
};

export const AuthProvider: FC = ({ children }) => {
    const { data, status } = useSession()
    const router = useRouter();
    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

    useEffect(() => {
        if (status === "authenticated") {

            dispatch({
                type: "[Auth] - Login",
                payload: data?.user as IUser,
            });
        }
    }, [status, data])

    // useEffect(() => {
    //     checkToken();
    // }, []);

    const checkToken = async () => {
        if (!Cookies.get("token")) return;
        try {

            const { data } = await tesloApi.get("user/validate-token");
            const { token, user } = data;
            Cookies.set("token", token);
            dispatch({ type: "[Auth] - Login", payload: user });
        } catch (error) {
            Cookies.set("token", "");
        }
    };

    const loginUser = async (email: string, password: string) => {
        try {
            const { data } = await tesloApi.post("/user/login", { email, password });
            const { token, user } = data;
            Cookies.set("token", token);
            dispatch({ type: "[Auth] - Login", payload: user });
            return true;
        } catch (error) {
            return false;
        }
    };

    const logout = () => {

        Cookies.remove("cart");

        Cookies.remove('name');
        Cookies.remove('lastName');
        Cookies.remove('address');
        Cookies.remove('address2');
        Cookies.remove('zip');
        Cookies.remove('city');
        Cookies.remove('country');
        Cookies.remove('phone');
        // Cookies.remove("token");
        // router.reload();
        signOut()


    }

    const registerUser = async (
        name: string,
        email: string,
        password: string
    ): Promise<{
        hasError: boolean;
        message?: string;
    }> => {
        try {
            const { data } = await tesloApi.post("/user/register", {
                name,
                email,
                password,
            });
            const { token, user } = data;
            Cookies.set("token", token);
            dispatch({ type: "[Auth] - Register", payload: user });
            return {
                hasError: false,
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message,
                };
            }
            return {
                hasError: true,
                message: "Ocurrió un error al registrar el usuario",
            };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,

                // METHODS
                loginUser,
                registerUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
