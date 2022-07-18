import { callApi, makeUrl } from "./base";

export async function getAuthUserOrders(input: { token: string }) {
	return callApi(makeUrl(`/orders/myorders`, {}), { headers: { Authorization: `Bearer ${input.token}` } });
}

export type CreateOrderDTO = {
	orderItems: {
		_id: string;
		product: string;
		name: string;
		image: string;
		price: number;
		countInStock: number;
		qty: number;
	}[];
	shippingAddress: {
		address: string;
		city: string;
		postalCode: string;
		country: string;
	};
	paymentMethod: string;
	itemsPrice: number;
	taxPrice: number;
	shippingPrice: number;
	totalPrice: number;
};

export async function placeUserOrder(input: { token: string } & CreateOrderDTO) {
	const { token, ...body } = input;
	return callApi(makeUrl(`/orders`, {}), {
		method: "POST",
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(body),
	});
}

export async function getOrderById(input: { token: string; orderId: string }) {
	const { token, orderId } = input;
	return callApi(makeUrl(`/orders/${orderId}`, {}), { headers: { Authorization: `Bearer ${token}` } });
}

export type MakePayPalPaymentDTO = {
	token: string;
	orderId: string;
	paymentResult: {
		id: string;
		status: string;
		update_time: string;
		email_address: string;
	};
};

export async function payOrder(input: MakePayPalPaymentDTO) {
	const { token, orderId, paymentResult } = input;
	return callApi(makeUrl(`/orders/${orderId}/pay`, {}), {
		method: "PUT",
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(paymentResult),
	});
}
