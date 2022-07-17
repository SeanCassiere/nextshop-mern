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

const paymentMethods = ["PayPal"] as const;
type PaymentMethod = typeof paymentMethods[number];

type CartAddress = {
	address: string;
	city: string;
	country: string;
	postalCode: string;
};

type CartType = {
	items: ContextCartItem[];
	shippingAddress: CartAddress;
	paymentMethod: PaymentMethod;
	itemsPrice: number;
	shippingPrice: number;
	taxPrice: number;
	totalPrice: number;
};

interface CartContextType extends CartType {
	setPaymentMethod: (method: PaymentMethod) => void;
	setAddress: (address: CartAddress) => void;
	addToCart: (item: Omit<ContextCartItem, "identifier">) => void;
	removeFromCart: (identifier: number) => void;
	resetCartContext: () => void;
	clearItems: () => void;
	paymentMethods: readonly PaymentMethod[];
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
	itemsPrice: 0,
	shippingPrice: 0,
	taxPrice: 0,
	totalPrice: 0,
};

const defaultContextValues: CartContextType = {
	...defaultCartValues,
	setPaymentMethod: () => {},
	setAddress() {},
	addToCart: () => {},
	removeFromCart: () => {},
	resetCartContext: () => {},
	clearItems: () => {},
	paymentMethods,
};

export const CartContext = React.createContext<CartContextType>(defaultContextValues);

export const useCart = () => React.useContext(CartContext);

const addDecimals = (num: number) => {
	const round = Math.round(num * 100) / 100;
	return Number(round.toFixed(2));
};

const TAX_PERCENTAGE = 0.15;
const SHIPPING_PERCENTAGE = 0.05;
const SHIPPING_MAXIMUM = 150;

function calculate(items: ContextCartItem[]) {
	const itemsPrice = addDecimals(items.reduce((acc, item) => acc + item.price * item.qty, 0));
	const shippingPrice = addDecimals(
		itemsPrice * SHIPPING_PERCENTAGE >= SHIPPING_MAXIMUM ? SHIPPING_MAXIMUM : itemsPrice * SHIPPING_PERCENTAGE
	);
	const taxPrice = addDecimals(itemsPrice * TAX_PERCENTAGE);

	const totalPrice = addDecimals(itemsPrice + shippingPrice + taxPrice);

	return {
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
	};
}

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
			const items = [...cart.items, cartItem];
			const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculate(items);
			setCart({
				...cart,
				items,
				itemsPrice,
				shippingPrice,
				taxPrice,
				totalPrice,
			});
		},
		[cart, setCart]
	);

	const removeFromCart = React.useCallback(
		(identifier: ContextCartItem["identifier"]) => {
			const items = cart.items.filter((item) => item.identifier !== identifier);
			const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculate(items);
			setCart({
				...cart,
				items,
				itemsPrice,
				shippingPrice,
				taxPrice,
				totalPrice,
			});
		},
		[cart, setCart]
	);

	const resetCartContext = React.useCallback(() => {
		setCart(defaultCartValues);
	}, [setCart]);

	const clearItems = React.useCallback(() => {
		const items: ContextCartItem[] = [];
		const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculate(items);
		setCart({
			...cart,
			items,
			itemsPrice,
			shippingPrice,
			taxPrice,
			totalPrice,
		});
	}, [cart, setCart]);

	const setCartAddress = React.useCallback(
		(address: CartAddress) => {
			setCart({ ...cart, shippingAddress: address });
		},
		[cart, setCart]
	);

	return (
		<CartContext.Provider
			value={{
				...cart,
				setPaymentMethod,
				setAddress: setCartAddress,
				addToCart,
				removeFromCart,
				resetCartContext,
				clearItems,
				paymentMethods,
			}}
		>
			{children}
		</CartContext.Provider>
	);
});
