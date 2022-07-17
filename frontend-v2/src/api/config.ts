import { makeUrl } from "./base";

export async function getPaypalClientId() {
	return fetch(makeUrl("/config/paypal", {})).then((res) => res.text());
}
