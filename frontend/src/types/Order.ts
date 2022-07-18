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
	itemsPrice: number;
	shippingPrice: number;
	taxPrice: number;
	totalPrice: number;
	user: {
		_id: string;
		name: string;
		email: string;
	};
	updatedAt: string;
	createdAt: string;
	paidAt?: string;
	deliveredAt?: string;
	paymentResult?: {
		email_address?: string;
		id: string;
		status: string;
		update_time?: string;
	};
};

export type OrderItem = {
	_id: string;
	name: string;
	image: string;
	qty: number;
	product: string;
	price: number;
};
