import { ICartProduct } from "../../interfaces";
import { CartState } from "./";
import { ShippingAdress } from './CartProvider';

type CartActionType =
  | {
      type: "[Cart] - LoadCart from cookies | storage";
      payload: ICartProduct[];
    }
  | { type: "[Cart] - Add Product"; payload: ICartProduct }
  | { type: "[Cart] - Change cart quantity"; payload: ICartProduct }
  | { type: "[Cart] - Remove product in cart"; payload: ICartProduct }
  | { type: "[Cart] - LoadAddress from Cookies"; payload: ShippingAdress }
  | { type: "[Cart] - Update ShippingAddress"; payload: ShippingAdress }
  | {
      type: "[Cart] - Update order summary";
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    } | { type: "[Cart] - Order complete" }

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[Cart] - LoadCart from cookies | storage":
      return {
        ...state,
        isLoaded: true,
        cart: action.payload,
      };

    case "[Cart] - Add Product":
      return reducerAddProduct(state, action.payload);

    case "[Cart] - Change cart quantity":
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.sizes !== action.payload.sizes) return product;

          return action.payload;
        }),
      };

    case "[Cart] - Remove product in cart":
      return {
        ...state,
        cart: state.cart.filter((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.sizes !== action.payload.sizes) return product;

          return false;
        }),
      };

      case "[Cart] - Update order summary":
        return {
          ...state,
          ...action.payload,
        }

        case "[Cart] - Update ShippingAddress":
        case "[Cart] - LoadAddress from Cookies":
          return {
            ...state,
            shippingAddress: action.payload,
          }

          case "[Cart] - Order complete":
          return {
            ...state,
            cart: [],
            numberOfItems: 0,
            subTotal: 0,
            tax: 0,
            total: 0,
          }

          

    default:
      return state;
  }
};

const reducerAddProduct = (state: CartState, product: ICartProduct) => {
  const findProduct = state.cart.find(
    (item) => item._id === product._id && item.sizes === product.sizes
  );
  if (findProduct) {
    return {
      ...state,
      cart: state.cart.map((item) => {
        if (item._id === product._id && findProduct.sizes === product.sizes) {
          return {
            ...item,
            quantity: item.quantity + product.quantity,
          };
        }
        return item;
      }),
    };
  }

  return {

    ...state,
    cart: [...state.cart, product],
  };
};
