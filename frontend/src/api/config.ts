import { makeUrl } from "./base";

export async function getPaypalClientId() {
	return await fetch(makeUrl("/config/paypal", {})).then((res) => res.text());
}
