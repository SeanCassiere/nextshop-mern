import { callApi, makeUrl } from "./base";

export async function getPublicProducts(params: { keyword?: string; pageNumber?: string | number }) {
	return callApi(makeUrl(`/products`, params));
}

export async function getPublicTopProducts() {
	return callApi(makeUrl(`/products/top`, {}));
}

export async function getPublicProductById(productId: string) {
	return callApi(makeUrl(`/products/${productId}`, {}));
}
