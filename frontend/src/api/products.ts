import { callApi, makeUrl } from "./base";

export async function getPublicProducts(params: { keyword?: string; pageNumber?: string | number }) {
	return callApi(makeUrl(`/products`, params));
}

export async function getPublicTopProducts(input: { pageSize?: string | number }) {
	return callApi(makeUrl(`/products/top`, { pageSize: input.pageSize ?? null }));
}

export async function getPublicProductById(productId: string) {
	return callApi(makeUrl(`/products/${productId}`, {}));
}

export async function postProductReview(input: { token: string; productId: string; comment: string; rating: number }) {
	const { productId, token, ...body } = input;
	return callApi(makeUrl(`/products/${productId}/reviews`, {}), {
		method: "POST",
		body: JSON.stringify(body),
		headers: { Authorization: `Bearer ${token}` },
	});
}
