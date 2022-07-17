export type Order = {
	_id: string;
	orderItems: OrderItem[];
	isDeliver: boolean;
	isPaid: boolean;
	paymentMethod: string;
	shippingAddress: {
		address: string;
		city: string;
		country: string;
		postalCode: string;
	};
	shippingPrice: number;
	taxPrice: number;
	totalPrice: number;
	user: string;
	updatedAt: string;
	createdAt: string;
	paidAt: string;
};

export type OrderItem = {
	_id: string;
	qty: number;
	product: string;
	name: string;
	image: string;
	price: number;
};
