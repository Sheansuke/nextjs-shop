import { FC, useEffect, useReducer } from "react";
import { ICartProduct } from "../../interfaces";
import { CartContext, cartReducer } from "./";

import Cookie from "js-cookie";
import { tesloApi } from "../../api";
import { IOrder } from '../../interfaces/IOrder';
import axios from "axios";

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAdress
}

export interface ShippingAdress {
    name: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}


const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined
};

export const CartProvider: FC = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

    useEffect(() => {
        loadCartFromCookie();
    }, []);

    useEffect(() => {
        loadAddessFromCookie()
    }, [])

    useEffect(() => {
        Cookie.set("cart", JSON.stringify(state.cart));
    }, [state.cart]);



    useEffect(() => {
        const numberOfItems = state.cart.reduce(
            (prev, current) => current.quantity + prev,
            0
        );
        const subTotal = state.cart.reduce(
            (prev, current) => current.price * current.quantity + prev,
            0
        );
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1),
        };

        dispatch({ type: "[Cart] - Update order summary", payload: orderSummary });
    }, [state.cart]);


    const loadCartFromCookie = () => {
        const cartCookie = Cookie.get("cart");
        if (cartCookie) {
            const cart = JSON.parse(cartCookie);
            dispatch({
                type: "[Cart] - LoadCart from cookies | storage",
                payload: cart,
            });
        } else {
            dispatch({ type: "[Cart] - LoadCart from cookies | storage", payload: [] });
        }
    };

    const loadAddessFromCookie = () => {
        if (Cookie.get("name")) {
            const shippingAddress = {
                name: Cookie.get("name") || "",
                lastName: Cookie.get("lastName") || "",
                address: Cookie.get("address") || "",
                address2: Cookie.get("address2") || "",
                zip: Cookie.get("zip") || "",
                city: Cookie.get("city") || "",
                country: Cookie.get("country") || "",
                phone: Cookie.get("phone") || "",
            }

            dispatch({ type: "[Cart] - LoadAddress from Cookies", payload: shippingAddress })
        }
    }

    const addProductToCart = (product: ICartProduct) => {
        dispatch({
            type: "[Cart] - Add Product",
            payload: product,
        });
    };

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({
            type: "[Cart] - Change cart quantity",
            payload: product,
        });
    };

    const removeCartProduct = (product: ICartProduct) => {
        dispatch({
            type: "[Cart] - Remove product in cart",
            payload: product,
        });
    };

    const updateAddress = (shippingAddress: ShippingAdress) => {
        Cookie.set("name", shippingAddress.name)
        Cookie.set("lastName", shippingAddress.lastName)
        Cookie.set("address", shippingAddress.address)
        Cookie.set("address2", shippingAddress.address2 || "")
        Cookie.set("zip", shippingAddress.zip)
        Cookie.set("city", shippingAddress.city)
        Cookie.set("country", shippingAddress.country)
        Cookie.set("phone", shippingAddress.phone)
        dispatch({
            type: "[Cart] - Update ShippingAddress",
            payload: shippingAddress,
        });
    }


    const createOrder = async (): Promise<{ hasError: boolean; message: string; }> => {
        if (!state.shippingAddress) {
            throw new Error("Please provide shipping address")
        }

        const body: IOrder = {
            orderItems: state.cart,
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            tax: state.tax,
            total: state.total,
            isPaid: false,
            subtotal: state.subTotal,

        }

        try {
            const { data } = await tesloApi.post<IOrder>("/orders", body)
            dispatch({ type: "[Cart] - Order complete" })
            return {
                hasError: false,
                message: data._id!
            }
        } catch (error: any) {

            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: "Error no controlado, hable con el administrador"
            }
        }
    }


    return (
        <CartContext.Provider
            value={{
                ...state,
                // METHODS
                addProductToCart,
                updateCartQuantity,
                removeCartProduct,
                updateAddress,

                // orders
                createOrder
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
