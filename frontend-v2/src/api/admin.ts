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
