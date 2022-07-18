import { callApi, makeUrl } from "./base";

export type LoginDTO = { email: string; password: string };

export async function loginUser(input: LoginDTO) {
	return callApi(makeUrl(`/users/login`, {}), {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export type RegisterDTO = {
	name: string;
	email: string;
	password: string;
};

export async function registerUser(input: RegisterDTO) {
	return callApi(makeUrl(`/users`, {}), {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export async function getAuthUserProfile(input: { token: string }) {
	return callApi(makeUrl(`/users/profile`, {}), { headers: { Authorization: `Bearer ${input.token}` } });
}

export async function updateAuthUser(input: { token: string; name: string; email: string; password: string }) {
	const { token, ...body } = input;
	return callApi(makeUrl(`/users/profile`, {}), {
		method: "PUT",
		body: JSON.stringify(body),
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
}
