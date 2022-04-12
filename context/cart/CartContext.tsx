import { createContext } from 'react'
import { ICartProduct } from '../../interfaces'
import { ShippingAdress } from './';


interface CartContextProps {
    isLoaded: boolean
    cart: ICartProduct[]
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;


    shippingAddress?: ShippingAdress

    // METHODS
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    removeCartProduct: (product: ICartProduct) => void;
    updateAddress: (shippingAddress: ShippingAdress) => void
    createOrder: () => Promise<{ hasError: boolean; message: string; }>
}


export const CartContext = createContext({} as CartContextProps)