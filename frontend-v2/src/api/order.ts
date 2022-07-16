import { callApi, makeUrl } from "./base";

export async function getAuthUserOrders(input: { token: string }) {
	return callApi(makeUrl(`/orders/myorders`, {}), { headers: { Authorization: `Bearer ${input.token}` } });
}
