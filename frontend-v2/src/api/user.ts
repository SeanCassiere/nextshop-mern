import { callApi, makeUrl } from "./base";

export async function loginUser(input: { email: string; password: string }) {
	return callApi(makeUrl(`/users/login`, {}), {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export async function registerUser(input: { name: string; email: string; password: string }) {
	return callApi(makeUrl(`/users`, {}), {
		method: "POST",
		body: JSON.stringify(input),
	});
}
