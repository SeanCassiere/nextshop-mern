import { callApi, makeUrl } from "./base";

export async function getUsersForAdmin(input: { token: string; pageNumber?: string | number }) {
	return callApi(makeUrl(`/users`, { pageNumber: input?.pageNumber ?? null }), {
		headers: { Authorization: `Bearer ${input.token}` },
	});
}

export async function getProductsForAdmin(input: { token: string; pageNumber?: string | number }) {
	return callApi(makeUrl(`/products/all`, { pageNumber: input?.pageNumber ?? null }), {
		headers: { Authorization: `Bearer ${input.token}` },
	});
}

export async function getOrdersForAdmin(input: { token: string; pageNumber?: string | number }) {
	return callApi(makeUrl(`/orders`, { pageNumber: input?.pageNumber ?? null }), {
		headers: { Authorization: `Bearer ${input.token}` },
	});
}

export type AdminOrderDeliveredDTO = { token: string; orderId: string };

export async function adminOrderDelivered(input: AdminOrderDeliveredDTO) {
	return callApi(makeUrl(`/orders/${input.orderId}/deliver`, {}), {
		method: "PUT",
		body: JSON.stringify({}),
		headers: { Authorization: `Bearer ${input.token}` },
	});
}
