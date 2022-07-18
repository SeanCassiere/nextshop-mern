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

export type AdminUpdateProductDTO = {
	token: string;
	productId: string;
	//
	name: string;
	image: string;
	brand: string;
	description: string;
	category: string;
	price: number;
	countInStock: number;
	isActive: boolean;
};

export async function adminUpdateProduct(input: AdminUpdateProductDTO) {
	const { token, productId, ...body } = input;
	return callApi(makeUrl(`/products/${input.productId}`, {}), {
		method: "PUT",
		body: JSON.stringify(body),
		headers: { Authorization: `Bearer ${input.token}` },
	});
}

export type AdminCreateProductDTO = {
	token: string;
};

export async function adminCreateProduct(input: AdminCreateProductDTO) {
	const { token } = input;
	return callApi(makeUrl(`/products`, {}), {
		method: "POST",
		body: JSON.stringify({}),
		headers: { Authorization: `Bearer ${token}` },
	});
}

export type AdminDeleteProductDTO = {
	token: string;
	productId: string;
};

export async function adminDeleteProduct(input: AdminDeleteProductDTO) {
	const { token, productId } = input;
	return callApi(makeUrl(`/products/${productId}`, {}), {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	});
}
