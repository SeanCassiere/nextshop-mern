import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type ContextCartItem = {
	identifier: number;
	id: string;
	name: string;
	image: string;
	price: number;
	countInStock: number;
	qty: number;
};

type PaymentMethod = "PayPal";

type CartType = {
	items: ContextCartItem[];
	shippingAddress: {
		address: string;
		city: string;
		country: string;
		postalCode: string;
	};
	paymentMethod: PaymentMethod;
};

interface CartContextType extends CartType {
	setPaymentMethod: (method: PaymentMethod) => void;
	addToCart: (item: Omit<ContextCartItem, "identifier">) => void;
	removeFromCart: (identifier: number) => void;
	clearCart: () => void;
}

const defaultCartValues: CartType = {
	items: [],
	shippingAddress: {
		address: "",
		city: "",
		country: "",
		postalCode: "",
	},
	paymentMethod: "PayPal",
};

const defaultContextValues: CartContextType = {
	...defaultCartValues,
	setPaymentMethod: () => {},
	addToCart: () => {},
	removeFromCart: () => {},
	clearCart: () => {},
};

export const CartContext = React.createContext<CartContextType>(defaultContextValues);

export const useCart = () => React.useContext(CartContext);

export const CartContextProvider = React.memo(({ children }: { children: React.ReactNode }) => {
	const [cartLocal, setCart] = useLocalStorage<CartType>("next-shop-cart", defaultCartValues);

	const cart = React.useMemo(() => cartLocal, [cartLocal]);

	const setPaymentMethod = React.useCallback(
		(paymentMethod: PaymentMethod) => {
			setCart({ ...cart, paymentMethod });
		},
		[cart, setCart]
	);

	const addToCart = React.useCallback(
		(item: Omit<ContextCartItem, "identifier">) => {
			const identifier = cart.items.length + 1;
			const cartItem: ContextCartItem = {
				identifier,
				...item,
			};
			setCart({
				...cart,
				items: [...cart.items, cartItem],
			});
		},
		[cart, setCart]
	);

	const removeFromCart = React.useCallback(
		(identifier: ContextCartItem["identifier"]) => {
			setCart({
				...cart,
				items: cart.items.filter((item) => item.identifier !== identifier),
			});
		},
		[cart, setCart]
	);

	const clearCart = React.useCallback(() => {
		setCart(defaultCartValues);
	}, [setCart]);

	return (
		<CartContext.Provider
			value={{
				...cart,
				setPaymentMethod,
				addToCart,
				removeFromCart,
				clearCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
});
